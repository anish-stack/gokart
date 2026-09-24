const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const Device = require('../models/Device');
const axios = require('axios');

const GOEXPRESS_API = 'https://goexpress.searchosis.com/api/method/get_parcel';
const COURIER_NAME = 'GO! Track Express';

// Frappe datetime "2026-09-05 18:19:36.110603" (IST, no tz) -> ISO string
const toISO = (val) => {
  if (!val) return null;
  const str = String(val).trim();
  // date only "2026-09-07"
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  const m = str.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})(\.\d+)?$/);
  if (!m) return str;
  const ms = m[3] ? m[3].slice(0, 4).padEnd(4, '0') : '.000';
  const d = new Date(`${m[1]}T${m[2]}${ms}+05:30`);
  return isNaN(d.getTime()) ? str : d.toISOString();
};

const clean = (v) => {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s ? s : null;
};

// last 4 digits only, receiver phone public tracking pe expose na ho
const maskPhone = (v) => {
  const s = clean(v);
  if (!s) return null;
  return s.length > 4 ? `${'*'.repeat(s.length - 4)}${s.slice(-4)}` : s;
};

// same status do jagah se aaye (tracking_updates + *_time field) to ek hi rakho
const normalizeKey = (status) =>
  String(status || '')
    .toLowerCase()
    .replace(/^shipment\s+/, '')
    .replace(/[^a-z]/g, '');

const STATUS_CODE_MAP = {
  booked: 'BOOKED',
  shipmentbooked: 'BOOKED',
  assigned: 'ASSIGNED',
  receivedatfranchise: 'RECEIVED',
  receiveatfrenchise: 'RECEIVED',
  intransit: 'IN_TRANSIT',
  outfordelivery: 'OUT_FOR_DELIVERY',
  delivered: 'DELIVERED',
  faileddelivery: 'FAILED_DELIVERY',
  ndr: 'FAILED_DELIVERY',
  returnedtowarehouse: 'RETURNED',
  returned: 'RETURNED',
  rtointransit: 'RTO_IN_TRANSIT',
  rto: 'RTO',
};

const getStatusCode = (status) =>
  STATUS_CODE_MAP[normalizeKey(status)] || 'UNKNOWN';

// timestamp fields on parcel doc -> event label
const TIME_FIELDS = [
  ['booking_date', 'Booked'],
  ['booked_time', 'Booked'],
  ['assigned_time', 'Assigned'],
  ['receive_at_frenchise_time', 'Received at Franchise'],
  ['in_transit_time', 'In Transit'],
  ['out_for_delivery_time', 'Out for Delivery'],
  ['ndr_time', 'Failed Delivery'],
  ['failed_delivery_time', 'Failed Delivery'],
  ['delivered_time', 'Delivered'],
  ['return_at_wh_time', 'Returned to Warehouse'],
  ['returned_time', 'Returned'],
  ['rto_in_transit_time', 'RTO In Transit'],
  ['rto_time', 'RTO'],
];

const buildEvents = (shipment) => {
  const events = [];
  const seen = new Set();

  // 1. tracking_updates (hub/location/remarks ke saath, isliye priority)
  (shipment.tracking_updates || []).forEach((u) => {
    const status = clean(u.status);
    if (!status) return;
    const key = normalizeKey(status);
    seen.add(key);
    events.push({
      status,
      statusCode: getStatusCode(status),
      time: toISO(u.date_time || u.creation),
      hub: clean(u.hub),
      location: clean(u.location),
      remarks: clean(u.remarks),
    });
  });

  // 2. timestamp fields jo tracking_updates me nahi aaye
  TIME_FIELDS.forEach(([field, label]) => {
    const t = shipment[field];
    if (!t) return;
    const key = normalizeKey(label);
    if (seen.has(key)) return;
    seen.add(key);
    events.push({
      status: label,
      statusCode: getStatusCode(label),
      time: toISO(t),
      hub: null,
      location: null,
      remarks: null,
    });
  });

  // oldest -> newest
  events.sort((a, b) => {
    const ta = a.time ? new Date(a.time).getTime() : 0;
    const tb = b.time ? new Date(b.time).getTime() : 0;
    return ta - tb;
  });

  return events;
};

// search partial match bhi de sakta hai, exact AWB wala pick karo
const pickShipment = (list, awb) => {
  if (!Array.isArray(list) || !list.length) return null;
  const q = awb.toUpperCase();
  return (
    list.find((s) =>
      [s.name, s.tracking_id, s.barcode, s.awbtracking_id]
        .filter(Boolean)
        .some((v) => String(v).toUpperCase() === q)
    ) || null
  );
};

const trackByAwb = asyncHandler(async (req, res) => {
  const { awb } = req.params;
  const deviceId = req.query.deviceId || req.headers['x-device-id'];

  if (!awb || !awb.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Tracking number is required.',
    });
  }

  const trackingAwb = awb.trim().toUpperCase();

  console.log(`Tracking AWB: ${trackingAwb} for deviceId: ${deviceId || 'N/A'}`);

  let apiResult;
  try {
    const response = await axios.get(GOEXPRESS_API, {
      params: { search: trackingAwb, page: 1, limit: 20 },
      timeout: 15000,
    });
    apiResult = response.data;
  } catch (err) {
    console.error(`GoExpress API error for ${trackingAwb}:`, err.message);
    const isTimeout = err.code === 'ECONNABORTED';
    return res.status(isTimeout ? 504 : 502).json({
      success: false,
      message: isTimeout
        ? 'Tracking service timed out. Please try again.'
        : 'Tracking service is unavailable. Please try again later.',
    });
  }

  const shipment = pickShipment(apiResult?.data, trackingAwb);

  if (!shipment) {
    return res.status(404).json({
      success: false,
      message: 'Shipment not found.',
    });
  }

  const events = buildEvents(shipment);
  const latestEvent = events[events.length - 1] || null;
  const status = clean(shipment.status) || latestEvent?.status || 'Unknown';
  const statusCode = getStatusCode(status);

  const result = {
    awb: shipment.tracking_id || shipment.name || trackingAwb,
    status,
    statusCode,
    isDelivered: statusCode === 'DELIVERED',

    courier: clean(shipment.company) || COURIER_NAME,
    courierPartner: clean(shipment.courier_partner_name) || clean(shipment.delivery_partner_name),

    origin: {
      hub: clean(shipment.origin_hub),
      city: clean(shipment.senderss_city),
      state: clean(shipment.senders_state),
      pincode: clean(shipment.sender_pin_code),
    },
    // API me receiver ka city/state galti se sender_city/sender_state naam se aata hai
    destination: {
      hub: clean(shipment.destination_hub),
      city: clean(shipment.sender_city),
      state: clean(shipment.sender_state),
      pincode: clean(shipment.receiver_pin_code),
    },
    currentLocation:
      clean(shipment.current_hub) ||
      latestEvent?.location ||
      latestEvent?.hub ||
      null,

    receiver: {
      name: clean(shipment.receiver__name),
      mobile: maskPhone(shipment.receiver_mobile),
    },

    shipment: {
      content: clean(shipment.content_of_shipment),
      deliveryType: clean(shipment.delivery_type),
      weight: shipment.parcel_weight ?? null,
      weightUnit: clean(shipment.weight),
      dimensions: {
        length: shipment.length != null ? Number(shipment.length) : null,
        width: shipment.width != null ? Number(shipment.width) : null,
        height: shipment.height != null ? Number(shipment.height) : null,
      },
      pieces: shipment.parcel_count || 1,
      deliveryAttempts: shipment.delivery_attempt_count || 0,
    },

    bookingDate: toISO(shipment.booking_date),
    eta: toISO(shipment.expected_delivery_date),
    deliveredAt: toISO(shipment.delivered_time),

    lastUpdated: latestEvent?.time || toISO(shipment.modified),

    events,
  };

  // Remember AWB for push notifications (tracking response fail na ho iski wajah se)
  if (deviceId && result.awb) {
    try {
      await Device.updateOne(
        { deviceId },
        { $addToSet: { trackedAwbs: result.awb } }
      );
    } catch (err) {
      console.error(`Device AWB save failed for ${deviceId}:`, err.message);
    }
  }
  console.log(result)
  return success(res, result);
});

module.exports = {
  trackByAwb,
};