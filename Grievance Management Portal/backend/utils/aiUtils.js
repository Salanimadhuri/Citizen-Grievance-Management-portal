const stringSimilarity = require('string-similarity');

// Category severity weights
const CATEGORY_WEIGHTS = {
  'Water Supply': 40,
  'Electricity': 30,
  'Road & Infrastructure': 25,
  'Waste Management': 20,
  'Public Safety': 35,
  'Other': 15
};

// Check for duplicate complaints within 200m radius
const findNearbyComplaints = async (Complaint, latitude, longitude, excludeId = null) => {
  const latRange = 0.002; // ~200m
  const lngRange = 0.002;
  
  const query = {
    status: { $ne: 'Resolved' },
    'location.latitude': { $gte: latitude - latRange, $lte: latitude + latRange },
    'location.longitude': { $gte: longitude - lngRange, $lte: longitude + lngRange }
  };
  
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  
  return await Complaint.find(query);
};

// Check text similarity between complaints
const checkTextSimilarity = (text1, text2) => {
  return stringSimilarity.compareTwoStrings(text1.toLowerCase(), text2.toLowerCase());
};

// Find duplicate complaint
const findDuplicateComplaint = async (Complaint, newComplaint) => {
  if (!newComplaint.location?.latitude || !newComplaint.location?.longitude) {
    return null;
  }
  
  const nearbyComplaints = await findNearbyComplaints(
    Complaint, 
    newComplaint.location.latitude, 
    newComplaint.location.longitude
  );
  
  for (const existing of nearbyComplaints) {
    const similarity = checkTextSimilarity(newComplaint.description, existing.description);
    if (similarity > 0.7) {
      return existing;
    }
  }
  
  return null;
};

// Calculate priority score
const calculatePriorityScore = (complaint) => {
  let score = CATEGORY_WEIGHTS[complaint.category] || 15;
  
  // Add duplicate count weight
  score += (complaint.duplicateCount || 0) * 5;
  
  // Add waiting time weight (5 points per day)
  const hoursWaiting = (Date.now() - new Date(complaint.createdAt)) / (1000 * 60 * 60);
  score += Math.floor(hoursWaiting / 24) * 5;
  
  // Cap at 100
  return Math.min(score, 100);
};

// Update priority scores for all complaints
const updatePriorityScores = async (Complaint) => {
  const complaints = await Complaint.find({ status: { $ne: 'Resolved' } });
  
  for (const complaint of complaints) {
    const newScore = calculatePriorityScore(complaint);
    await Complaint.findByIdAndUpdate(complaint._id, { priorityScore: newScore });
  }
};

module.exports = {
  findDuplicateComplaint,
  calculatePriorityScore,
  updatePriorityScores,
  findNearbyComplaints,
  checkTextSimilarity
};