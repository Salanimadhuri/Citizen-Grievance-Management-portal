const User = require('../models/User');
const Complaint = require('../models/Complaint');
const generateToken = require('../utils/generateToken');
const { createNotification } = require('./notificationController');

const createOfficer = async (req, res) => {
  try {
    const { name, email, phone, password, departmentId } = req.body;
    console.log('Creating officer with department:', departmentId);

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const officer = await User.create({
      name,
      email,
      phone,
      password,
      role: 'officer',
      status: 'approved',
      department: departmentId,
    });

    console.log('Officer created with department:', officer.department);

    res.status(201).json({
      _id: officer._id,
      name: officer.name,
      email: officer.email,
      phone: officer.phone,
      role: officer.role,
      department: officer.department,
    });
  } catch (error) {
    console.error('Error creating officer:', error);
    res.status(500).json({ message: error.message });
  }
};

const getAllOfficers = async (req, res) => {
  try {
    console.log('Fetching all officers...');
    const officers = await User.find({ 
      role: 'officer',
      status: { $in: ['approved', 'pending'] }
    })
      .populate('department', 'name')
      .select('-password')
      .sort({ name: 1 });
    
    console.log(`Found ${officers.length} officers:`);
    officers.forEach(officer => {
      console.log(`Officer: ${officer.name}, Status: ${officer.status}, Department: ${officer.department?.name || 'N/A'}`);
    });
    
    res.json(officers);
  } catch (error) {
    console.error('Error fetching officers:', error);
    res.status(500).json({ message: error.message });
  }
};

const getOfficersByDepartment = async (req, res) => {
  try {
    const officers = await User.find({ 
      role: 'officer',
      department: req.params.departmentId 
    })
      .select('-password')
      .sort({ name: 1 });
    
    res.json(officers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: { $in: ['Submitted', 'Under Review'] } });
    const inProgress = await Complaint.countDocuments({ status: { $in: ['Assigned', 'In Progress'] } });
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });

    const byCategory = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { name: '$_id', value: '$count', _id: 0 } }
    ]);

    const byStatus = await Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { name: '$_id', value: '$count', _id: 0 } }
    ]);

    res.json({
      stats: { total: totalComplaints, pending, inProgress, resolved },
      byCategory,
      byStatus,
      resolutionRate: [
        { name: 'Current', resolved, pending: pending + inProgress }
      ],
      departmentPerformance: [],
      monthlyTrends: [],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOfficer = async (req, res) => {
  try {
    const { name, email, phone, department } = req.body;

    const officer = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, department },
      { new: true }
    ).populate('department', 'name');

    if (!officer) {
      return res.status(404).json({ message: 'Officer not found' });
    }

    res.json(officer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating officer' });
  }
};

const getOfficerRequests = async (req, res) => {
  try {
    console.log('Fetching officer requests...');
    const requests = await User.find({ role: 'officer', status: 'pending' })
      .populate('department', 'name')
      .select('-password')
      .sort({ createdAt: -1 });
    
    console.log(`Found ${requests.length} pending officer requests:`, requests);
    res.json(requests);
  } catch (error) {
    console.error('Error fetching officer requests:', error);
    res.status(500).json({ message: error.message });
  }
};

const approveOfficer = async (req, res) => {
  try {
    console.log(`Approving officer with ID: ${req.params.id}`);
    
    const officer = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    ).populate('department', 'name');

    if (!officer) {
      return res.status(404).json({ message: 'Officer not found' });
    }

    console.log(`Officer approved: ${officer.name}, Department: ${officer.department?.name}`);
    
    res.json({ message: 'Officer approved successfully', officer });
  } catch (error) {
    console.error('Error approving officer:', error);
    res.status(500).json({ message: error.message });
  }
};

const rejectOfficer = async (req, res) => {
  try {
    const officer = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );

    if (!officer) {
      return res.status(404).json({ message: 'Officer not found' });
    }

    res.json({ message: 'Officer rejected successfully', officer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOfficer,
  getAllOfficers,
  getOfficersByDepartment,
  getAnalytics,
  updateOfficer,
  getOfficerRequests,
  approveOfficer,
  rejectOfficer,
};
