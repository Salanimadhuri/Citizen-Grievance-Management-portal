const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { createNotification } = require('./notificationController');
const { findDuplicateComplaint, calculatePriorityScore } = require('../utils/aiUtils');
const { calculateSemanticSimilarity, classifyComplaintCategory, predictComplaintPriority, predictEscalationRisk, analyzeComplaintTrends } = require('../utils/aiEnhancedUtils');

// Helper function for distance calculation
const getDistance = (pos1, pos2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = pos1.latitude * Math.PI/180;
  const φ2 = pos2.latitude * Math.PI/180;
  const Δφ = (pos2.latitude-pos1.latitude) * Math.PI/180;
  const Δλ = (pos2.longitude-pos1.longitude) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
};

const createComplaint = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const location = JSON.parse(req.body.location || '{}');
    
    // Handle multiple images
    const imageUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    
    // AI Auto-Classification if category not provided
    let finalCategory = category;
    if (!category || category === 'Other') {
      const classification = classifyComplaintCategory(title, description);
      if (classification.confidence > 0.6) {
        finalCategory = classification.category;
      }
    }
    
    const newComplaint = {
      title,
      description,
      category: finalCategory,
      location,
      imageUrl: imageUrls.length > 0 ? imageUrls[0] : null,
      images: imageUrls,
      userId: req.user._id,
    };
    
    // AI Semantic Duplicate Detection
    const existingComplaints = await Complaint.find({
      status: { $ne: 'Resolved' },
      duplicateOf: { $exists: false }
    });
    
    let duplicateOf = null;
    for (const existing of existingComplaints) {
      const semanticSimilarity = calculateSemanticSimilarity(
        `${title} ${description}`,
        `${existing.title} ${existing.description}`
      );
      
      // Check geospatial distance if both have locations
      let withinDistance = true;
      if (location.latitude && location.longitude && 
          existing.location?.latitude && existing.location?.longitude) {
        const distance = getDistance(
          { latitude: location.latitude, longitude: location.longitude },
          { latitude: existing.location.latitude, longitude: existing.location.longitude }
        );
        withinDistance = distance < 200; // 200 meters
      }
      
      if (semanticSimilarity > 0.75 && withinDistance) {
        duplicateOf = existing;
        break;
      }
    }
    
    if (duplicateOf) {
      await Complaint.findByIdAndUpdate(duplicateOf._id, {
        $inc: { duplicateCount: 1 }
      });
      newComplaint.duplicateOf = duplicateOf._id;
      newComplaint.status = 'Duplicate';
    }
    
    const complaint = await Complaint.create(newComplaint);
    
    // AI Priority Prediction
    const priorityScore = predictComplaintPriority({
      category: finalCategory,
      duplicateCount: duplicateOf ? duplicateOf.duplicateCount + 1 : 0,
      locationImportance: 0.5,
      citizensAffected: 1,
      description
    });
    
    await Complaint.findByIdAndUpdate(complaint._id, { priorityScore });

    // Notify all admins
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await createNotification(
        admin._id,
        duplicateOf ? 'Duplicate Complaint Detected' : 'New Complaint Submitted',
        duplicateOf 
          ? `A duplicate complaint "${title}" was detected and linked to existing complaint`
          : `A new complaint "${title}" has been submitted by ${req.user.name}`,
        'complaint_submitted',
        complaint._id
      );
    }

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllComplaints = async (req, res) => {
  try {
    console.log('Admin fetching all complaints...');
    const complaints = await Complaint.find()
      .populate('userId', 'name email')
      .populate('departmentId', 'name')
      .populate('assignedOfficer', 'name email')
      .populate('duplicateOf', 'title')
      .sort({ priorityScore: -1, escalated: -1, createdAt: -1 });
    
    console.log(`Found ${complaints.length} complaints for admin`);
    
    res.json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ message: error.message });
  }
};

const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user._id })
      .populate('departmentId', 'name')
      .populate('assignedOfficer', 'name')
      .sort({ createdAt: -1 });
    
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('departmentId', 'name contactEmail')
      .populate('assignedOfficer', 'name email');
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateComplaintStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    
    const complaint = await Complaint.findById(req.params.id).populate('userId');
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Check if officer is authorized to update this complaint
    if (req.user.role === 'officer' && complaint.assignedOfficer?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this complaint' });
    }

    const oldStatus = complaint.status;
    complaint.status = status;
    complaint.remarks = remarks;

    if (status === 'Under Review' && !complaint.reviewedAt) {
      complaint.reviewedAt = Date.now();
    }
    if (status === 'Assigned' && !complaint.assignedAt) {
      complaint.assignedAt = Date.now();
    }
    if (status === 'In Progress' && !complaint.inProgressAt) {
      complaint.inProgressAt = Date.now();
    }
    if (status === 'Resolved' && !complaint.resolvedAt) {
      complaint.resolvedAt = Date.now();
    }

    await complaint.save();

    // Notify citizen about status update
    if (oldStatus !== status) {
      await createNotification(
        complaint.userId._id,
        'Complaint Status Updated',
        `Your complaint "${complaint.title}" status changed to ${status}`,
        status === 'Resolved' ? 'complaint_resolved' : 'status_updated',
        complaint._id
      );
    }
    
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    await complaint.deleteOne();
    
    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAssignedComplaints = async (req, res) => {
  try {
    console.log(`Officer ${req.user._id} fetching assigned complaints...`);
    const complaints = await Complaint.find({ assignedOfficer: req.user._id })
      .populate('userId', 'name email')
      .populate('departmentId', 'name')
      .populate('feedback')
      .sort({ createdAt: -1 });
    
    console.log(`Found ${complaints.length} complaints assigned to officer ${req.user._id}`);
    
    // Ensure safe data structure
    const safeComplaints = complaints.map(complaint => ({
      ...complaint.toObject(),
      userId: complaint.userId || { name: 'Unknown Citizen', email: 'N/A' },
      departmentId: complaint.departmentId || { name: 'N/A' },
      location: complaint.location || {},
      feedback: complaint.feedback || null
    }));
    
    res.json(safeComplaints);
  } catch (error) {
    console.error('Error fetching assigned complaints:', error);
    res.status(500).json({ message: 'Error fetching complaints' });
  }
};

const getOfficerComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      _id: req.params.id,
      assignedOfficer: req.user._id
    })
      .populate('userId', 'name email phone')
      .populate('departmentId', 'name contactEmail')
      .populate('assignedOfficer', 'name email');
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found or not assigned to you' });
    }
    
    res.json(complaint);
  } catch (error) {
    console.error('Error fetching officer complaint:', error);
    res.status(500).json({ message: 'Error fetching complaint' });
  }
};

const getComplaintLocations = async (req, res) => {
  try {
    const { category, status, startDate, endDate } = req.query;
    
    const filter = {
      'location.latitude': { $exists: true },
      'location.longitude': { $exists: true }
    };
    
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const complaints = await Complaint.find(filter).select('location status priorityScore escalated category title description createdAt');

    // AI Smart Heatmap Analytics
    const trends = analyzeComplaintTrends(complaints);
    
    const heatmapData = complaints.map(complaint => {
      let intensity = 0.3; // Base intensity
      
      // AI-based intensity calculation
      intensity += (complaint.priorityScore || 0) / 200;
      
      // Boost escalated complaints
      if (complaint.escalated) intensity += 0.3;
      
      // Status-based intensity
      if (complaint.status === 'Submitted') intensity += 0.2;
      else if (complaint.status === 'Under Review') intensity += 0.1;
      
      // Boost emerging hotspots
      const isHotspot = trends.emergingHotspots.some(hotspot => {
        const [lat, lng] = hotspot.location.split(',');
        return Math.abs(parseFloat(lat) - complaint.location.latitude) < 0.01 &&
               Math.abs(parseFloat(lng) - complaint.location.longitude) < 0.01;
      });
      
      if (isHotspot) intensity += 0.4;
      
      return [
        complaint.location.latitude,
        complaint.location.longitude,
        Math.min(intensity, 1.0)
      ];
    });

    res.json({ heatmapData, trends });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const assignComplaint = async (req, res) => {
  try {
    const { departmentId, assignedOfficer } = req.body;
    console.log(`Assigning complaint ${req.params.id} to officer ${assignedOfficer}`);
    console.log('Assignment data:', { departmentId, assignedOfficer });
    
    const complaint = await Complaint.findById(req.params.id).populate('userId');
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.departmentId = departmentId;
    complaint.assignedOfficer = assignedOfficer;
    complaint.status = 'Assigned';
    complaint.assignedAt = Date.now();

    await complaint.save();
    console.log('Complaint saved with assignedOfficer:', complaint.assignedOfficer);

    // Notify officer about assignment
    await createNotification(
      assignedOfficer,
      'New Complaint Assigned',
      `You have been assigned complaint "${complaint.title}"`,
      'complaint_assigned',
      complaint._id
    );

    // Notify citizen about assignment
    await createNotification(
      complaint.userId._id,
      'Complaint Assigned',
      `Your complaint "${complaint.title}" has been assigned to a department`,
      'complaint_assigned',
      complaint._id
    );
    
    const updatedComplaint = await Complaint.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('departmentId', 'name')
      .populate('assignedOfficer', 'name email');
    
    console.log('Complaint assigned successfully:', updatedComplaint.assignedOfficer);
    res.json(updatedComplaint);
  } catch (error) {
    console.error('Error assigning complaint:', error);
    res.status(500).json({ message: error.message });
  }
};

// AI Analytics Endpoints
const getEscalationRisks = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      status: { $nin: ['Resolved', 'Duplicate'] }
    }).populate('departmentId');
    
    const riskyComplaints = [];
    
    for (const complaint of complaints) {
      const daysSinceSubmission = Math.floor(
        (Date.now() - new Date(complaint.createdAt)) / (1000 * 60 * 60 * 24)
      );
      
      const departmentWorkload = await Complaint.countDocuments({
        departmentId: complaint.departmentId?._id,
        status: { $nin: ['Resolved', 'Duplicate'] }
      });
      
      const riskAnalysis = predictEscalationRisk({
        category: complaint.category,
        priorityScore: complaint.priorityScore,
        departmentWorkload,
        daysSinceSubmission,
        slaHours: complaint.departmentId?.slaHours || 72
      });
      
      if (riskAnalysis.shouldEscalate || riskAnalysis.riskScore > 70) {
        riskyComplaints.push({
          ...complaint.toObject(),
          riskAnalysis
        });
      }
    }
    
    res.json(riskyComplaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAIInsights = async (req, res) => {
  try {
    const complaints = await Complaint.find();
    const trends = analyzeComplaintTrends(complaints);
    
    // Category distribution with AI predictions
    const categoryStats = {};
    complaints.forEach(complaint => {
      if (!categoryStats[complaint.category]) {
        categoryStats[complaint.category] = {
          count: 0,
          avgPriority: 0,
          escalated: 0
        };
      }
      categoryStats[complaint.category].count++;
      categoryStats[complaint.category].avgPriority += complaint.priorityScore || 0;
      if (complaint.escalated) categoryStats[complaint.category].escalated++;
    });
    
    Object.keys(categoryStats).forEach(category => {
      categoryStats[category].avgPriority = Math.round(
        categoryStats[category].avgPriority / categoryStats[category].count
      );
    });
    
    res.json({
      trends,
      categoryStats,
      totalComplaints: complaints.length,
      aiProcessed: complaints.filter(c => c.priorityScore > 0).length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComplaint,
  getAllComplaints,
  getMyComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
  getAssignedComplaints,
  getOfficerComplaintById,
  getComplaintLocations,
  assignComplaint,
  getEscalationRisks,
  getAIInsights,
};