const mongoose = require('mongoose');
const { SUPPORTED_LANGUAGES } = require('../utils/constants');

const deviceSchema = new mongoose.Schema(
  {
    deviceId: { type: String, required: true, unique: true, index: true },
    pushToken: { type: String, default: '' },
    platform: { type: String, enum: ['ios', 'android', 'web'], required: true },
    language: { type: String, enum: SUPPORTED_LANGUAGES, default: 'en' },
    notifPrefs: {
      shipment: { type: Boolean, default: true },
      marketing: { type: Boolean, default: true },
      service: { type: Boolean, default: true },
    },
    trackedAwbs: [{ type: String, uppercase: true }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Device', deviceSchema);
