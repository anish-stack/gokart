const mongoose = require('mongoose');
const translatedFieldSchema = require('./translatedField');

const serviceSchema = new mongoose.Schema(
  {
    title: { type: translatedFieldSchema, required: true },
    description: { type: translatedFieldSchema, required: true },
    buttonText: { type: translatedFieldSchema, default: () => ({}) },
    externalUrl: { type: String, default: 'https://example.com' },
    icon: { type: String, default: '' },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

serviceSchema.index({ sortOrder: 1 });

module.exports = mongoose.model('Service', serviceSchema);
