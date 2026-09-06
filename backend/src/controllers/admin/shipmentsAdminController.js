const asyncHandler = require('../../utils/asyncHandler');
const { success, failure } = require('../../utils/apiResponse');
const Shipment = require('../../models/Shipment');
const ShipmentEvent = require('../../models/ShipmentEvent');

const listShipments = asyncHandler(async (req, res) => {
  const shipments = await Shipment.find().sort({ updatedAt: -1 }).limit(200);
  return success(res, shipments);
});

const getShipment = asyncHandler(async (req, res) => {
  const shipment = await Shipment.findById(req.params.id);
  if (!shipment) return failure(res, 'Shipment not found', 404, 'NOT_FOUND');
  const events = await ShipmentEvent.find({ shipment: shipment._id }).sort({ occurredAt: 1 });
  return success(res, { shipment, events });
});

module.exports = { listShipments, getShipment };
