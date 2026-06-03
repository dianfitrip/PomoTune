const express = require('express');
const { getTracks, addTrack, deleteTrack, upload } = require('../controllers/audioController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', authMiddleware, getTracks);
// upload.single('audioFile') akan menangkap file dari frontend
router.post('/', authMiddleware, upload.single('audioFile'), addTrack); 
router.delete('/:id', authMiddleware, deleteTrack);

module.exports = router;