const ContactArea = require('../models/ContactArea');
const ContactSubmission = require('../models/ContactSubmission');

function isPincodeInRange(pincode, start, end) {
  if (!start || !end) return false;
  const num = parseInt(pincode, 10);
  const startNum = parseInt(start, 10);
  const endNum = parseInt(end, 10);
  if (Number.isNaN(num) || Number.isNaN(startNum) || Number.isNaN(endNum)) return false;
  return num >= startNum && num <= endNum;
}

/**
 * Resolves regional support contact info by priority:
 * exact pincode -> pincode range -> city -> state -> country -> default.
 * `location` optionally carries city/state/country for a richer match when
 * only a pincode is looked up via the URL param.
 */
async function resolveContactByPincode(pincode, location = {}) {
  const areas = await ContactArea.find({ isActive: true }).sort({ priority: -1 });

  const exact = areas.find((area) => area.matchType === 'pincode' && area.pincode === pincode);
  if (exact) return exact;

  const range = areas.find(
    (area) => area.matchType === 'pincode_range' && isPincodeInRange(pincode, area.pincodeRangeStart, area.pincodeRangeEnd)
  );
  if (range) return range;

  if (location.city) {
    const cityMatch = areas.find(
      (area) => area.matchType === 'city' && area.city.toLowerCase() === location.city.toLowerCase()
    );
    if (cityMatch) return cityMatch;
  }

  if (location.state) {
    const stateMatch = areas.find(
      (area) => area.matchType === 'state' && area.state.toLowerCase() === location.state.toLowerCase()
    );
    if (stateMatch) return stateMatch;
  }

  const countryMatch = areas.find((area) => area.matchType === 'country');
  if (countryMatch) return countryMatch;

  const fallback = areas.find((area) => area.matchType === 'default');
  return fallback || null;
}

async function submitContactForm(payload) {
  return ContactSubmission.create(payload);
}

module.exports = { resolveContactByPincode, submitContactForm };
