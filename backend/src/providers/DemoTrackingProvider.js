const TrackingProvider = require('./TrackingProvider');
const { SHIPMENT_STATUSES } = require('../utils/constants');

/**
 * Deterministic demo data for AWBs: GO123456789, GO987654321, GO555555555.
 * Any other AWB that looks well-formed gets a generic simulated shipment so
 * the app is fully testable without real credentials; truly unknown/short
 * AWBs raise AWB_NOT_FOUND.
 */
const DEMO_DATA = {
  GO123456789: {
    courier: 'GO! Express',
    origin: 'New Delhi, DL',
    destination: 'Mumbai, MH',
    finalStatus: 'DELIVERED',
  },
  GO987654321: {
    courier: 'GO! Express',
    origin: 'Bengaluru, KA',
    destination: 'Kolkata, WB',
    finalStatus: 'OUT_FOR_DELIVERY',
  },
  GO555555555: {
    courier: 'GO! Courier',
    origin: 'Chennai, TN',
    destination: 'Pune, MH',
    finalStatus: 'IN_TRANSIT',
  },
};

const EVENT_SEQUENCE = ['BOOKED', 'PICKED_UP', 'IN_TRANSIT', 'ARRIVED_AT_HUB', 'OUT_FOR_DELIVERY', 'DELIVERED'];

function buildEvents(finalStatus, origin, destination) {
  const finalIndex = EVENT_SEQUENCE.indexOf(finalStatus);
  const cutoff = finalIndex === -1 ? EVENT_SEQUENCE.length - 1 : finalIndex;
  const now = Date.now();

  return EVENT_SEQUENCE.map((status, idx) => {
    const hoursAgo = (cutoff - idx) * 8;
    const occurredAt = new Date(now - Math.max(hoursAgo, idx > cutoff ? -1 : 0) * 60 * 60 * 1000);
    let state = 'pending';
    if (idx < cutoff) state = 'done';
    else if (idx === cutoff) state = 'current';

    const locationByStatus = {
      BOOKED: origin,
      PICKED_UP: origin,
      IN_TRANSIT: 'In transit',
      ARRIVED_AT_HUB: 'Regional hub',
      OUT_FOR_DELIVERY: destination,
      DELIVERED: destination,
    };

    const descriptionByStatus = {
      BOOKED: 'Shipment booked and label generated',
      PICKED_UP: 'Shipment picked up from sender',
      IN_TRANSIT: 'Shipment in transit to destination hub',
      ARRIVED_AT_HUB: 'Arrived at destination regional hub',
      OUT_FOR_DELIVERY: 'Out for delivery to receiver',
      DELIVERED: 'Delivered successfully',
    };

    return {
      status,
      location: locationByStatus[status],
      description: descriptionByStatus[status],
      occurredAt: idx <= cutoff ? occurredAt : null,
      state,
    };
  }).filter((event) => event.state !== 'pending' || EVENT_SEQUENCE.indexOf(event.status) === cutoff + 1);
}

function isWellFormedAwb(awb) {
  return typeof awb === 'string' && /^[A-Z0-9]{6,20}$/i.test(awb);
}

class DemoTrackingProvider extends TrackingProvider {
  async trackShipment(awbRaw) {
    const awb = (awbRaw || '').toUpperCase().trim();

    if (!isWellFormedAwb(awb)) {
      const err = new Error('Shipment not found for the given AWB number');
      err.code = 'AWB_NOT_FOUND';
      throw err;
    }

    const known = DEMO_DATA[awb];
    const seed = known || {
      courier: 'GO! Express',
      origin: 'New Delhi, DL',
      destination: 'Hyderabad, TS',
      finalStatus: SHIPMENT_STATUSES[Math.abs(hashCode(awb)) % 4],
    };

    const events = buildEvents(seed.finalStatus, seed.origin, seed.destination);
    const currentEvent = [...events].reverse().find((e) => e.state === 'current') || events[events.length - 1];

    return {
      awb,
      courier: seed.courier,
      status: seed.finalStatus,
      origin: seed.origin,
      destination: seed.destination,
      currentLocation: currentEvent ? currentEvent.location : seed.origin,
      eta: seed.finalStatus === 'DELIVERED' ? null : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      lastUpdated: new Date(),
      events,
    };
  }
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

module.exports = DemoTrackingProvider;
