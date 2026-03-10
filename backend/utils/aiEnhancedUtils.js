const natural = require('natural');
const compromise = require('compromise');
const { LinearRegression } = require('ml-regression');

// AI Semantic Duplicate Detection
const calculateSemanticSimilarity = (text1, text2) => {
  // Tokenize and normalize texts
  const tokens1 = natural.WordTokenizer().tokenize(text1.toLowerCase());
  const tokens2 = natural.WordTokenizer().tokenize(text2.toLowerCase());
  
  // Remove stop words
  const stopWords = natural.stopwords;
  const cleanTokens1 = tokens1.filter(token => !stopWords.includes(token));
  const cleanTokens2 = tokens2.filter(token => !stopWords.includes(token));
  
  // Calculate Jaccard similarity
  const set1 = new Set(cleanTokens1);
  const set2 = new Set(cleanTokens2);
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  const jaccardSimilarity = intersection.size / union.size;
  
  // Calculate TF-IDF similarity
  const tfidf = new natural.TfIdf();
  tfidf.addDocument(cleanTokens1);
  tfidf.addDocument(cleanTokens2);
  
  const vector1 = [];
  const vector2 = [];
  const terms = new Set([...cleanTokens1, ...cleanTokens2]);
  
  terms.forEach(term => {
    vector1.push(tfidf.tfidf(term, 0));
    vector2.push(tfidf.tfidf(term, 1));
  });
  
  const cosineSimilarity = natural.CosineSimilarity(vector1, vector2);
  
  // Combine similarities (weighted average)
  return (jaccardSimilarity * 0.4) + (cosineSimilarity * 0.6);
};

// AI Complaint Category Classification
const classifyComplaintCategory = (title, description) => {
  const text = `${title} ${description}`.toLowerCase();
  const doc = compromise(text);
  
  // Category keywords with weights
  const categoryKeywords = {
    'Road & Infrastructure': {
      keywords: ['road', 'street', 'bridge', 'footpath', 'sidewalk', 'pothole', 'construction', 'traffic', 'signal', 'streetlight', 'lamp'],
      weight: 0
    },
    'Water Supply': {
      keywords: ['water', 'pipe', 'leak', 'supply', 'tap', 'drainage', 'sewage', 'plumbing', 'tank', 'bore'],
      weight: 0
    },
    'Electricity': {
      keywords: ['electricity', 'power', 'light', 'cable', 'transformer', 'outage', 'voltage', 'meter', 'wire'],
      weight: 0
    },
    'Waste Management': {
      keywords: ['garbage', 'waste', 'trash', 'dustbin', 'cleaning', 'sanitation', 'dump', 'litter'],
      weight: 0
    },
    'Public Safety': {
      keywords: ['safety', 'crime', 'police', 'security', 'theft', 'violence', 'emergency', 'fire', 'accident'],
      weight: 0
    }
  };
  
  // Calculate weights for each category
  Object.keys(categoryKeywords).forEach(category => {
    categoryKeywords[category].keywords.forEach(keyword => {
      if (text.includes(keyword)) {
        categoryKeywords[category].weight += 1;
      }
    });
  });
  
  // Find category with highest weight
  let maxWeight = 0;
  let predictedCategory = 'Other';
  
  Object.keys(categoryKeywords).forEach(category => {
    if (categoryKeywords[category].weight > maxWeight) {
      maxWeight = categoryKeywords[category].weight;
      predictedCategory = category;
    }
  });
  
  return {
    category: predictedCategory,
    confidence: maxWeight > 0 ? Math.min(maxWeight / 3, 1) : 0
  };
};

// AI Dynamic Priority Prediction
const predictComplaintPriority = (complaintData) => {
  const {
    category,
    duplicateCount = 0,
    locationImportance = 0.5, // 0-1 scale
    citizensAffected = 1,
    description = ''
  } = complaintData;
  
  // Base priority by category
  const categoryWeights = {
    'Public Safety': 40,
    'Water Supply': 35,
    'Electricity': 30,
    'Road & Infrastructure': 25,
    'Waste Management': 20,
    'Other': 15
  };
  
  let priority = categoryWeights[category] || 15;
  
  // Urgency keywords boost
  const urgentKeywords = ['emergency', 'urgent', 'dangerous', 'broken', 'leak', 'fire', 'accident'];
  const urgencyBoost = urgentKeywords.some(keyword => 
    description.toLowerCase().includes(keyword)
  ) ? 20 : 0;
  
  // Duplicate count impact
  const duplicateBoost = Math.min(duplicateCount * 5, 25);
  
  // Location importance
  const locationBoost = locationImportance * 15;
  
  // Citizens affected
  const citizenBoost = Math.min(Math.log(citizensAffected) * 5, 15);
  
  priority += urgencyBoost + duplicateBoost + locationBoost + citizenBoost;
  
  return Math.min(Math.round(priority), 100);
};

// Predictive Escalation Risk
const predictEscalationRisk = (complaintData) => {
  const {
    category,
    priorityScore,
    departmentWorkload = 10, // number of pending complaints
    daysSinceSubmission = 0,
    slaHours = 72
  } = complaintData;
  
  // Risk factors
  const categoryRisk = {
    'Public Safety': 0.8,
    'Water Supply': 0.7,
    'Electricity': 0.6,
    'Road & Infrastructure': 0.5,
    'Waste Management': 0.4,
    'Other': 0.3
  };
  
  const baseRisk = categoryRisk[category] || 0.3;
  const priorityRisk = priorityScore / 100;
  const workloadRisk = Math.min(departmentWorkload / 20, 1);
  const timeRisk = Math.min(daysSinceSubmission / (slaHours / 24), 1);
  
  const overallRisk = (baseRisk * 0.3) + (priorityRisk * 0.3) + (workloadRisk * 0.2) + (timeRisk * 0.2);
  
  return {
    riskScore: Math.round(overallRisk * 100),
    shouldEscalate: overallRisk > 0.7,
    predictedDaysToResolve: Math.round(slaHours / 24 * (1 + workloadRisk))
  };
};

// Smart Heatmap Analytics
const analyzeComplaintTrends = (complaints) => {
  const trends = {
    emergingHotspots: [],
    recurringIssues: [],
    categoryTrends: {}
  };
  
  // Group complaints by location (approximate)
  const locationGroups = {};
  complaints.forEach(complaint => {
    if (complaint.location?.latitude && complaint.location?.longitude) {
      const lat = Math.round(complaint.location.latitude * 100) / 100;
      const lng = Math.round(complaint.location.longitude * 100) / 100;
      const key = `${lat},${lng}`;
      
      if (!locationGroups[key]) {
        locationGroups[key] = [];
      }
      locationGroups[key].push(complaint);
    }
  });
  
  // Identify emerging hotspots (locations with increasing complaints)
  Object.keys(locationGroups).forEach(location => {
    const locationComplaints = locationGroups[location];
    if (locationComplaints.length >= 3) {
      const recentComplaints = locationComplaints.filter(c => 
        new Date(c.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );
      
      if (recentComplaints.length >= 2) {
        trends.emergingHotspots.push({
          location,
          totalComplaints: locationComplaints.length,
          recentComplaints: recentComplaints.length,
          categories: [...new Set(locationComplaints.map(c => c.category))]
        });
      }
    }
  });
  
  // Category trends
  const categoryCount = {};
  complaints.forEach(complaint => {
    categoryCount[complaint.category] = (categoryCount[complaint.category] || 0) + 1;
  });
  
  trends.categoryTrends = categoryCount;
  
  return trends;
};

module.exports = {
  calculateSemanticSimilarity,
  classifyComplaintCategory,
  predictComplaintPriority,
  predictEscalationRisk,
  analyzeComplaintTrends
};