const Communication = require('../models/Communication');
const Complaint = require('../models/Complaint');

const sendMessage = async (req, res) => {
  try {
    const { complaintId, receiverId, message } = req.body;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Authorization: citizen can only message officer assigned to their complaint
    if (req.user.role === 'citizen' && complaint.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Authorization: officer can only message citizen whose complaint is assigned to them
    if (req.user.role === 'officer' && complaint.assignedOfficer?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const comm = await Communication.create({
      complaintId,
      senderId: req.user._id,
      receiverId,
      message,
    });

    await comm.populate('senderId', 'name role');
    res.status(201).json(comm);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { complaintId } = req.params;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Authorization check
    if (req.user.role === 'citizen' && complaint.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (req.user.role === 'officer' && complaint.assignedOfficer?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const messages = await Communication.find({ complaintId })
      .populate('senderId', 'name role')
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Communication.updateMany(
      { complaintId, receiverId: req.user._id, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getConversations = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'citizen') {
      query = { $or: [{ senderId: req.user._id }, { receiverId: req.user._id }] };
    } else if (req.user.role === 'officer') {
      query = { $or: [{ senderId: req.user._id }, { receiverId: req.user._id }] };
    }

    const conversations = await Communication.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$complaintId',
          lastMessage: { $last: '$message' },
          lastMessageTime: { $last: '$createdAt' },
          unreadCount: {
            $sum: {
              $cond: [{ $and: [{ $eq: ['$receiverId', req.user._id] }, { $eq: ['$read', false] }] }, 1, 0]
            }
          }
        }
      },
      { $sort: { lastMessageTime: -1 } },
      {
        $lookup: {
          from: 'complaints',
          localField: '_id',
          foreignField: '_id',
          as: 'complaint'
        }
      },
      { $unwind: '$complaint' }
    ]);

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getConversations,
};
