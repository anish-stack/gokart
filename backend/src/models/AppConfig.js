const mongoose = require('mongoose');

const appConfigSchema = new mongoose.Schema(
  {
    appName: { type: String, default: 'GO! Track Express' },
    logo: { type: String, default: '' },
    supportPhone: { type: String, default: '' },
    supportEmail: { type: String, default: '' },
    website: { type: String, default: 'https://example.com' },
    maintenanceMode: { type: Boolean, default: false },
    maintenanceMessage: { type: String, default: 'We are undergoing scheduled maintenance. Please check back soon.' },
    minimumAppVersion: { type: String, default: '1.0.0' },
    latestAppVersion: { type: String, default: '1.0.0' },
    storeUrlIOS: { type: String, default: 'https://example.com' },
    storeUrlAndroid: { type: String, default: 'https://example.com' },
    socialLinks: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AppConfig', appConfigSchema);
