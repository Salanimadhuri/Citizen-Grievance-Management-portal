const mongoose = require('mongoose');

const communicationSchema = new mongoose.Schema({
  complaintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint',
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

communicationSchema.index({ complaintId: 1, createdAt: -1 });
communicationSchema.index({ receiverId: 1, read: 1 });

module.exports = mongoose.model('Communication', communicationSchema);
