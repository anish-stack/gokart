function success(res, data, statusCode = 200, meta) {
  const body = { success: true, data };
  if (meta) body.meta = meta;
  return res.status(statusCode).json(body);
}

function failure(res, message, statusCode = 400, code = 'BAD_REQUEST') {
  return res.status(statusCode).json({ success: false, message, code });
}

module.exports = { success, failure };
