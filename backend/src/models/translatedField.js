const mongoose = require('mongoose');

/**
 * Reusable sub-schema for per-language translated text fields.
 * Shape: { en, hi, mr, bn, kn, te }
 */
const translatedFieldSchema = new mongoose.Schema(
  {
    en: { type: String, default: '' },
    hi: { type: String, default: '' },
    mr: { type: String, default: '' },
    bn: { type: String, default: '' },
    kn: { type: String, default: '' },
    te: { type: String, default: '' },
  },
  { _id: false }
);

module.exports = translatedFieldSchema;
