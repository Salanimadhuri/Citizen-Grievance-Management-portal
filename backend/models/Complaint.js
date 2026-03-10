const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Road & Infrastructure', 'Water Supply', 'Electricity', 'Waste Management', 'Public Safety', 'Other'],
  },
  location: {
    address: String,
    latitude: Number,
    longitude: Number,
  },
  imageUrl: {
    type: String,
  },
  images: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Work Scheduled', 'Resolved'],
    default: 'Submitted',
  },
  priorityScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  duplicateOf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint',
  },
  duplicateCount: {
    type: Number,
    default: 0,
  },
  escalated: {
    type: Boolean,
    default: false,
  },
  feedbackSubmitted: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
  },
  assignedOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  remarks: {
    type: String,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  reviewedAt: Date,
  assignedAt: Date,
  inProgressAt: Date,
  resolvedAt: Date,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field to get feedback for this complaint
complaintSchema.virtual('feedback', {
  ref: 'Feedback',
  localField: '_id',
  foreignField: 'complaintId',
  justOne: true
});

module.exports = mongoose.model('Complaint', complaintSchema);
