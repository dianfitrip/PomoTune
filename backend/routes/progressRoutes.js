const express = require('express');
const { getProgressStats } = require('../controllers/progressController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getProgressStats);

module.exports = router;