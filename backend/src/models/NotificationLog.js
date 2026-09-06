const mongoose = require('mongoose');

const notificationLogSchema = new mongoose.Schema(
  {
    device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
    awb: { type: String, uppercase: true, index: true },
    status: { type: String, default: '' },
    title: { type: String, default: '' },
    body: { type: String, default: '' },
    type: { type: String, enum: ['shipment', 'marketing', 'service'], default: 'shipment' },
    // dedupe key: `${awb}:${status}:${deviceId}`
    dedupeKey: { type: String, index: true },
    sentAt: { type: Date, default: Date.now },
    success: { type: Boolean, default: true },
    error: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('NotificationLog', notificationLogSchema);
