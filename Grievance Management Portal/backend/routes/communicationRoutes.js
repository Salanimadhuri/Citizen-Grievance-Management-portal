const express = require('express');
const { sendMessage, getMessages, getConversations } = require('../controllers/communicationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/conversations', protect, getConversations);
router.get('/:complaintId', protect, getMessages);

module.exports = router;
