const asyncHandler = require('../utils/asyncHandler');
const { success, failure } = require('../utils/apiResponse');
const contactService = require('../services/contactService');

const getContactByPincode = asyncHandler(async (req, res) => {
  const { pincode } = req.params;
  const { city, state, country } = req.query;

  const area = await contactService.resolveContactByPincode(pincode, { city, state, country });
  if (!area) return failure(res, 'No support contact configured for this location', 404, 'NOT_FOUND');

  return success(res, {
    contactName: area.contactName,
    phone: area.phone,
    email: area.email,
    whatsapp: area.whatsapp,
    address: area.address,
    workingHours: area.workingHours,
  });
});

const submitContact = asyncHandler(async (req, res) => {
  const submission = await contactService.submitContactForm(req.body);
  return success(res, { id: submission._id }, 201);
});

module.exports = { getContactByPincode, submitContact };
