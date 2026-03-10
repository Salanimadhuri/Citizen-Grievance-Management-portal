const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// Get all officers
router.get('/officers', protect, authorize('admin'), async (req, res) => {
  try {
    console.log('Fetching officers...');
    const { department } = req.query;
    
    let query = { role: 'officer' };
    if (department) {
      query.department = department;
    }
    
    const officers = await User.find(query)
      .select('-password')
      .populate('department', 'name')
      .sort({ name: 1 });
    
    console.log(`Found ${officers.length} officers`);
    res.json(officers);
  } catch (error) {
    console.error('Error fetching officers:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all users (admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('department', 'name')
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;