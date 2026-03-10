const express = require('express');
const {
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
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/', protect, authorize('citizen'), upload.array('images', 3), createComplaint);
router.get('/', protect, authorize('admin'), getAllComplaints);
router.get('/my', protect, authorize('citizen'), getMyComplaints);
router.get('/locations', protect, authorize('admin'), getComplaintLocations);
router.get('/ai/risks', protect, authorize('admin'), getEscalationRisks);
router.get('/ai/insights', protect, authorize('admin'), getAIInsights);
router.get('/officer', protect, authorize('officer'), getAssignedComplaints);
router.patch('/:id/assign', protect, authorize('admin'), assignComplaint);
router.get('/officer/:id', protect, authorize('officer'), getOfficerComplaintById);
router.get('/:id', protect, getComplaintById);
router.patch('/:id/status', protect, authorize('officer', 'admin'), updateComplaintStatus);
router.delete('/:id', protect, authorize('admin'), deleteComplaint);

module.exports = router;
