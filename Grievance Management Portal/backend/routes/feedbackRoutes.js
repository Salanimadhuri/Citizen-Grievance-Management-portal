const express = require('express');
const {
  createFeedback,
  getFeedbackByComplaint,
  getRecentFeedback,
  getOfficerFeedback,
} = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', protect, authorize('citizen'), createFeedback);
router.get('/recent', protect, getRecentFeedback);
router.get('/officer', protect, authorize('officer'), getOfficerFeedback);
router.get('/:complaintId', protect, getFeedbackByComplaint);

module.exports = router;
