const mongoose = require('mongoose');
const translatedFieldSchema = require('./translatedField');
const { CMS_SLUGS } = require('../utils/constants');

const cmsPageSchema = new mongoose.Schema(
  {
    slug: { type: String, enum: CMS_SLUGS, required: true, unique: true, index: true },
    title: { type: translatedFieldSchema, required: true },
    body: { type: translatedFieldSchema, required: true },
    // Optional structured extras used by the About page (MD name, mission/vision, CIN, registered office)
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
    isEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CMSPage', cmsPageSchema);
