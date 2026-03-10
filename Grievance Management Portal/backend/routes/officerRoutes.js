const express = require('express');
const { registerOfficer } = require('../controllers/officerController');

const router = express.Router();

router.post('/register', registerOfficer);

module.exports = router;