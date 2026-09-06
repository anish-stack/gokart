const env = require('../config/env');
const DemoTrackingProvider = require('./DemoTrackingProvider');
const AWBProvider = require('./AWBProvider');

/**
 * Returns the active tracking provider instance based on TRACKING_PROVIDER.
 * Defaults to the demo provider so the app works fully without real credentials.
 */
function getTrackingProvider() {
  switch (env.TRACKING_PROVIDER) {
    case 'awb':
      return new AWBProvider();
    case 'demo':
    default:
      return new DemoTrackingProvider();
  }
}

module.exports = { getTrackingProvider };
