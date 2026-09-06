const mongoose = require('mongoose');
const { SHIPMENT_STATUSES } = require('../utils/constants');

const shipmentSchema = new mongoose.Schema(
  {
    awb: { type: String, required: true, unique: true, index: true, trim: true, uppercase: true },
    courier: { type: String, default: 'GO! Express' },
    status: { type: String, enum: SHIPMENT_STATUSES, default: 'BOOKED' },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    currentLocation: { type: String, default: '' },
    eta: { type: Date },
    lastUpdated: { type: Date, default: Date.now },
    senderName: { type: String, default: '' },
    receiverName: { type: String, default: '' },
    weightKg: { type: Number, default: 0 },
    pieces: { type: Number, default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Shipment', shipmentSchema);
