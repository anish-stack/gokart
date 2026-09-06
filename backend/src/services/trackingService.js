const Shipment = require('../models/Shipment');
const ShipmentEvent = require('../models/ShipmentEvent');
const { getTrackingProvider } = require('../providers');
const { cacheGet, cacheSet } = require('../config/redis');
const notificationService = require('./notificationService');
const logger = require('../utils/logger');

const CACHE_TTL_SECONDS = 60;

/**
 * Tracks a shipment by AWB. Mobile never talks to the provider directly:
 * mobile -> backend (this service) -> provider -> backend -> mobile.
 * Result is persisted locally (Shipment + ShipmentEvent) so admins can see
 * history, and a shipment-status push notification is triggered on change.
 */
async function trackShipment(awbRaw) {
  const awb = (awbRaw || '').toUpperCase().trim();
  const cacheKey = `tracking:${awb}`;

  const cached = await cacheGet(cacheKey);
  if (cached) return cached;

  const provider = getTrackingProvider();
  const result = await provider.trackShipment(awb);

  const previous = await Shipment.findOne({ awb });
  const previousStatus = previous ? previous.status : null;

  const shipment = await Shipment.findOneAndUpdate(
    { awb },
    {
      awb,
      courier: result.courier,
      status: result.status,
      origin: result.origin,
      destination: result.destination,
      currentLocation: result.currentLocation,
      eta: result.eta,
      lastUpdated: result.lastUpdated || new Date(),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  if (Array.isArray(result.events) && result.events.length > 0) {
    await ShipmentEvent.deleteMany({ shipment: shipment._id });
    await ShipmentEvent.insertMany(
      result.events.map((event) => ({
        shipment: shipment._id,
        awb,
        status: event.status,
        location: event.location,
        description: event.description,
        occurredAt: event.occurredAt || undefined,
        state: event.state,
      }))
    );
  }

  const response = {
    awb: shipment.awb,
    courier: shipment.courier,
    status: shipment.status,
    origin: shipment.origin,
    destination: shipment.destination,
    currentLocation: shipment.currentLocation,
    eta: shipment.eta,
    lastUpdated: shipment.lastUpdated,
    events: result.events || [],
  };

  await cacheSet(cacheKey, response, CACHE_TTL_SECONDS);

  if (previousStatus && previousStatus !== shipment.status) {
    notificationService
      .sendShipmentStatusNotification(shipment.awb, shipment.status)
      .catch((err) => logger.warn(`Notification dispatch failed: ${err.message}`));
  }

  return response;
}

module.exports = { trackShipment };
