const mongoose = require('mongoose');

const contactSubmissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    pincode: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: 'India' },
    message: { type: String, required: true },
    status: { type: String, enum: ['NEW', 'IN_PROGRESS', 'RESOLVED'], default: 'NEW' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContactSubmission', contactSubmissionSchema);
