const { initFirebase } = require('../config/firebase');
const Device = require('../models/Device');
const NotificationLog = require('../models/NotificationLog');
const { NOTIFICATION_TRIGGER_STATUSES } = require('../utils/constants');
const logger = require('../utils/logger');

const STATUS_MESSAGES = {
  PICKED_UP: (awb) => ({ title: 'Shipment picked up', body: `Your shipment ${awb} has been picked up.` }),
  IN_TRANSIT: (awb) => ({ title: 'Shipment in transit', body: `Your shipment ${awb} is on its way.` }),
  OUT_FOR_DELIVERY: (awb) => ({ title: 'Out for delivery', body: `Your shipment ${awb} is out for delivery today.` }),
  DELIVERED: (awb) => ({ title: 'Delivered', body: `Your shipment ${awb} has been delivered. Thank you for choosing GO!` }),
};

/**
 * Registers or updates an anonymous device for push notifications.
 */
async function registerDevice({ deviceToken, platform, language, deviceId }) {
  const id = deviceId || deviceToken;
  const device = await Device.findOneAndUpdate(
    { deviceId: id },
    { deviceId: id, pushToken: deviceToken, platform, language: language || 'en' },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return device;
}

async function unregisterDevice(deviceId) {
  await Device.deleteOne({ deviceId });
}

/**
 * Sends a raw push notification to a single device via FCM. No-ops safely
 * (with a log) when Firebase credentials aren't configured yet - demo mode.
 */
async function sendPushNotification(device, { title, body, data = {} }) {
  const admin = initFirebase();

  if (!admin || !device.pushToken) {
    logger.info(`[demo] Would push to ${device.deviceId}: ${title} - ${body}`);
    return { success: true, demo: true };
  }

  try {
    await admin.messaging().send({
      token: device.pushToken,
      notification: { title, body },
      data: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])),
    });
    return { success: true };
  } catch (err) {
    logger.error(`FCM send failed for ${device.deviceId}: ${err.message}`);
    return { success: false, error: err.message };
  }
}

/**
 * Sends a shipment status-change notification to every device tracking
 * this AWB, deduped by AWB+status per device.
 */
async function sendShipmentStatusNotification(awb, status) {
  if (!NOTIFICATION_TRIGGER_STATUSES.includes(status)) return;

  const messageBuilder = STATUS_MESSAGES[status];
  if (!messageBuilder) return;

  const devices = await Device.find({ trackedAwbs: awb, 'notifPrefs.shipment': true });

  await Promise.all(
    devices.map(async (device) => {
      const dedupeKey = `${awb}:${status}:${device.deviceId}`;
      const alreadySent = await NotificationLog.findOne({ dedupeKey });
      if (alreadySent) return;

      const { title, body } = messageBuilder(awb);
      const result = await sendPushNotification(device, { title, body, data: { awb, status } });

      await NotificationLog.create({
        device: device._id,
        awb,
        status,
        title,
        body,
        type: 'shipment',
        dedupeKey,
        success: result.success,
        error: result.error || '',
      });
    })
  );
}

module.exports = {
  registerDevice,
  unregisterDevice,
  sendPushNotification,
  sendShipmentStatusNotification,
};
