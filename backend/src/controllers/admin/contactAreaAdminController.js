const asyncHandler = require('../../utils/asyncHandler');
const { success, failure } = require('../../utils/apiResponse');
const ContactArea = require('../../models/ContactArea');
const ContactSubmission = require('../../models/ContactSubmission');

const listAreas = asyncHandler(async (req, res) => {
  const areas = await ContactArea.find().sort({ priority: -1, createdAt: -1 });
  return success(res, areas);
});

const createArea = asyncHandler(async (req, res) => {
  const area = await ContactArea.create(req.body);
  return success(res, area, 201);
});

const updateArea = asyncHandler(async (req, res) => {
  const area = await ContactArea.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!area) return failure(res, 'Contact area not found', 404, 'NOT_FOUND');
  return success(res, area);
});

const removeArea = asyncHandler(async (req, res) => {
  const area = await ContactArea.findByIdAndDelete(req.params.id);
  if (!area) return failure(res, 'Contact area not found', 404, 'NOT_FOUND');
  return success(res, { deleted: true });
});

const listSubmissions = asyncHandler(async (req, res) => {
  const submissions = await ContactSubmission.find().sort({ createdAt: -1 }).limit(200);
  return success(res, submissions);
});

const updateSubmissionStatus = asyncHandler(async (req, res) => {
  const submission = await ContactSubmission.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );
  if (!submission) return failure(res, 'Submission not found', 404, 'NOT_FOUND');
  return success(res, submission);
});

module.exports = { listAreas, createArea, updateArea, removeArea, listSubmissions, updateSubmissionStatus };
