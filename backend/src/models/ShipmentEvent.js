const mongoose = require('mongoose');
const { SHIPMENT_STATUSES } = require('../utils/constants');

const shipmentEventSchema = new mongoose.Schema(
  {
    shipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipment', required: true, index: true },
    awb: { type: String, required: true, index: true, uppercase: true },
    status: { type: String, enum: SHIPMENT_STATUSES, required: true },
    location: { type: String, default: '' },
    description: { type: String, default: '' },
    occurredAt: { type: Date, default: Date.now },
    // 'done' -> checkmark, 'current' -> filled dot, 'pending' -> empty dot
    state: { type: String, enum: ['done', 'current', 'pending'], default: 'pending' },
  },
  { timestamps: true }
);

shipmentEventSchema.index({ awb: 1, occurredAt: 1 });

module.exports = mongoose.model('ShipmentEvent', shipmentEventSchema);
