/**
 * Base class for tracking providers. Duck-typed: any provider implementing
 * `trackShipment(awb)` and returning the shape below can be swapped in via
 * the TRACKING_PROVIDER env var with zero changes to mobile or controllers.
 *
 * Expected resolved shape:
 * {
 *   awb, courier, status, origin, destination, currentLocation, eta, lastUpdated,
 *   events: [{ status, location, description, occurredAt, state }]
 * }
 * Or throws a NotFoundError-like Error with `.code = 'AWB_NOT_FOUND'` if unknown.
 */
class TrackingProvider {
  // eslint-disable-next-line no-unused-vars
  async trackShipment(awb) {
    throw new Error('not implemented');
  }
}

module.exports = TrackingProvider;
