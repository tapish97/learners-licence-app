import mongoose from 'mongoose';
import crypto from 'crypto';

const submissionSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    address: { type: String, required: true },

    aadhaarFile: { type: String, required: true },
    photoFile: { type: String, required: true },
    signatureFile: { type: String, required: true },

    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    internalNotes: { type: String },
    submissionId: { type: String, unique: true },
  },
  {
    timestamps: true,
  }
);

// Auto-generate submissionId before save
submissionSchema.pre('save', function (next) {
  if (!this.submissionId) {
    this.submissionId = 'SUB-' + crypto.randomBytes(4).toString('hex');
  }
  next();
});

export default mongoose.model('Submission', submissionSchema);