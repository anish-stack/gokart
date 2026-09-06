const mongoose = require('mongoose');

/**
 * Resolves regional support contact details.
 * Priority order when matching a request: exact pincode -> pincode range -> city -> state -> country -> default.
 */
const contactAreaSchema = new mongoose.Schema(
  {
    matchType: {
      type: String,
      enum: ['pincode', 'pincode_range', 'city', 'state', 'country', 'default'],
      required: true,
      index: true,
    },
    pincode: { type: String, default: '' },
    pincodeRangeStart: { type: String, default: '' },
    pincodeRangeEnd: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: 'India' },

    contactName: { type: String, required: true },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    address: { type: String, default: '' },
    workingHours: { type: String, default: '' },

    priority: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContactArea', contactAreaSchema);
