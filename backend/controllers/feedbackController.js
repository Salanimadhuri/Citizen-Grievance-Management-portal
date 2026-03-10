const Feedback = require('../models/Feedback');
const Complaint = require('../models/Complaint');

const createFeedback = async (req, res) => {
  try {
    const { complaintId, rating, comment } = req.body;

    const complaint = await Complaint.findById(complaintId);
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.status !== 'Resolved') {
      return res.status(400).json({ message: 'Can only provide feedback for resolved complaints' });
    }

    if (complaint.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to provide feedback for this complaint' });
    }

    const feedbackExists = await Feedback.findOne({ complaintId, userId: req.user._id });
    if (feedbackExists) {
      return res.status(400).json({ message: 'Feedback already submitted for this complaint' });
    }

    const feedback = await Feedback.create({
      complaintId,
      userId: req.user._id,
      rating,
      comment,
    });

    // Mark complaint as feedback submitted
    await Complaint.findByIdAndUpdate(complaintId, {
      feedbackSubmitted: true
    });

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFeedbackByComplaint = async (req, res) => {
  try {
    const feedback = await Feedback.findOne({ complaintId: req.params.complaintId })
      .populate('userId', 'name');
    
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecentFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name')
      .populate('complaintId', 'title');
    
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOfficerFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate({
        path: 'complaintId',
        match: { assignedOfficer: req.user._id },
        select: 'title category assignedOfficer'
      })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
    
    // Filter out feedback where complaint is null (not assigned to this officer)
    const officerFeedback = feedback.filter(f => f.complaintId !== null);
    
    res.json(officerFeedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createFeedback,
  getFeedbackByComplaint,
  getRecentFeedback,
  getOfficerFeedback,
};
