const express = require('express');
const { saveSession } = require('../controllers/sessionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, saveSession);

module.exports = router;