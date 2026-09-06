const mongoose = require('mongoose');
const translatedFieldSchema = require('./translatedField');

const productSchema = new mongoose.Schema(
  {
    name: { type: translatedFieldSchema, required: true },
    description: { type: translatedFieldSchema, required: true },
    image: { type: String, default: '' },
    price: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
    externalUrl: { type: String, default: 'https://example.com' },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ sortOrder: 1 });

module.exports = mongoose.model('Product', productSchema);
