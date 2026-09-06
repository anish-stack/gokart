const axios = require('axios');
const TrackingProvider = require('./TrackingProvider');
const env = require('../config/env');
const logger = require('../utils/logger');

/**
 * Real third-party AWB tracking provider. Swap in via TRACKING_PROVIDER=awb
 * once AWB_API_URL / AWB_API_KEY are supplied - no mobile or controller
 * changes required since this implements the same duck-typed interface as
 * DemoTrackingProvider.
 */
class AWBProvider extends TrackingProvider {
  async trackShipment(awb) {
    try {
      const response = await axios.get(`${env.AWB_API_URL}/track/${encodeURIComponent(awb)}`, {
        headers: { Authorization: `Bearer ${env.AWB_API_KEY}` },
        timeout: 10000,
      });

      // NOTE: mapping below assumes the upstream provider's response shape.
      // Adjust field mapping once real API docs are available.
      return response.data;
    } catch (err) {
      if (err.response && err.response.status === 404) {
        const notFound = new Error('Shipment not found for the given AWB number');
        notFound.code = 'AWB_NOT_FOUND';
        throw notFound;
      }
      logger.error(`AWBProvider error: ${err.message}`);
      const providerErr = new Error('Tracking provider is temporarily unavailable');
      providerErr.code = 'PROVIDER_ERROR';
      throw providerErr;
    }
  }
}

module.exports = AWBProvider;
