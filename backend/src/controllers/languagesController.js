const { success } = require('../utils/apiResponse');
const { SUPPORTED_LANGUAGES, LANGUAGE_LABELS } = require('../utils/constants');

function listLanguages(req, res) {
  const languages = SUPPORTED_LANGUAGES.map((code) => ({ code, label: LANGUAGE_LABELS[code] }));
  return success(res, languages);
}

module.exports = { listLanguages };
