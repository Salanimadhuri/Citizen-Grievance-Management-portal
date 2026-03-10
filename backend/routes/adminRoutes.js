const express = require('express');
const {
  createOfficer,
  getAllOfficers,
  getOfficersByDepartment,
  getAnalytics,
  updateOfficer,
  getOfficerRequests,
  approveOfficer,
  rejectOfficer,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/create-officer', protect, authorize('admin'), createOfficer);
router.patch('/officers/:id', protect, authorize('admin'), updateOfficer);
router.get('/officer-requests', protect, authorize('admin'), getOfficerRequests);
router.patch('/approve-officer/:id', protect, authorize('admin'), approveOfficer);
router.patch('/reject-officer/:id', protect, authorize('admin'), rejectOfficer);
router.get('/officers', protect, authorize('admin'), getAllOfficers);
router.get('/officers/department/:departmentId', protect, authorize('admin'), getOfficersByDepartment);
router.get('/analytics', protect, authorize('admin'), getAnalytics);
router.get('/stats', protect, authorize('admin'), getAnalytics);
router.get('/charts', protect, authorize('admin'), getAnalytics);

module.exports = router;
