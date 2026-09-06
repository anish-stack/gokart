const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const Device = require('../models/Device');
const axios = require('axios');

const trackByAwb = asyncHandler(async (req, res) => {
  const { awb } = req.params;

  const deviceId =
    req.query.deviceId || req.headers['x-device-id'];

  if (!awb || !awb.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Tracking number is required.',
    });
  }

  const trackingAwb = awb.trim();

  console.log(
    `Tracking AWB: ${trackingAwb} for deviceId: ${deviceId || 'N/A'}`
  );

  const response = await axios.get(
    'https://goexpress.searchosis.com/api/method/get_parcel',
    {
      params: {
        search: trackingAwb,
      },
      timeout: 15000,
    }
  );

  const apiResult = response.data;

  console.log(
    `Received tracking result for AWB ${trackingAwb}:`,
    apiResult
  );

  // API returns data as an array
  const shipment = apiResult?.data?.[0];

  if (!shipment) {
    return res.status(404).json({
      success: false,
      message: 'Shipment not found.',
    });
  }

  const result = {
    awb: shipment.name || trackingAwb,
    status: shipment.status || 'Unknown',

    courier: 'GO! Track Express',

    origin: null,
    destination: null,
    currentLocation: null,

    eta: null,

    lastUpdated:
      shipment.delivered_time ||
      shipment.out_for_delivery_time ||
      shipment.in_transit_time ||
      shipment.booked_time ||
      null,

    events: [
      shipment.booked_time && {
        status: 'Booked',
        time: shipment.booked_time,
      },

      shipment.assigned_time && {
        status: 'Assigned',
        time: shipment.assigned_time,
      },

      shipment.receive_at_frenchise_time && {
        status: 'Received at Franchise',
        time: shipment.receive_at_frenchise_time,
      },

      shipment.in_transit_time && {
        status: 'In Transit',
        time: shipment.in_transit_time,
      },

      shipment.out_for_delivery_time && {
        status: 'Out for Delivery',
        time: shipment.out_for_delivery_time,
      },

      shipment.delivered_time && {
        status: 'Delivered',
        time: shipment.delivered_time,
      },

      shipment.failed_delivery_time && {
        status: 'Failed Delivery',
        time: shipment.failed_delivery_time,
      },

      shipment.return_at_wh_time && {
        status: 'Returned to Warehouse',
        time: shipment.return_at_wh_time,
      },

      shipment.returned_time && {
        status: 'Returned',
        time: shipment.returned_time,
      },

      shipment.rto_in_transit_time && {
        status: 'RTO In Transit',
        time: shipment.rto_in_transit_time,
      },

      shipment.rto_time && {
        status: 'RTO',
        time: shipment.rto_time,
      },
    ].filter(Boolean),
  };

  // Remember AWB for push notifications
  if (deviceId && result.awb) {
    await Device.updateOne(
      { deviceId },
      {
        $addToSet: {
          trackedAwbs: result.awb,
        },
      }
    );
  }

  return success(res, result);
});

module.exports = {
  trackByAwb,
};