const mongoose = require('mongoose');
const translatedFieldSchema = require('./translatedField');

/**
 * Article / blog-style content shown in the mobile app (e.g. news, tips,
 * announcements). Backend-driven like Services/Products/CMS - no hardcoded
 * copy or images ship in the mobile bundle.
 */
const articleSchema = new mongoose.Schema(
  {
    title: { type: translatedFieldSchema, required: true },
    summary: { type: translatedFieldSchema, default: () => ({}) },
    body: { type: translatedFieldSchema, required: true },
    coverImage: { type: String, default: '' },
    author: { type: String, default: 'GO! Track Express' },
    tags: [{ type: String, trim: true, lowercase: true }],
    isPublished: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

articleSchema.index({ isPublished: 1, publishedAt: -1 });
articleSchema.index({ tags: 1 });

module.exports = mongoose.model('Article', articleSchema);
