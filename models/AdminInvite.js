import mongoose from 'mongoose';

const adminInviteSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email',
    ],
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  accepted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index to automatically delete expired invites
adminInviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const AdminInvite = mongoose.model('AdminInvite', adminInviteSchema);

export default AdminInvite;
