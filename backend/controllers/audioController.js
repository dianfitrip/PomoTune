const AudioTrack = require('../models/AudioTrack');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Buat folder otomatis jika belum ada
const uploadDir = path.join(__dirname, '../uploads/audio');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

const getTracks = async (req, res) => {
    try {
        const tracks = await AudioTrack.findAll();
        res.json(tracks);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const addTrack = async (req, res) => {
    try {
        const { title, category } = req.body;
        if (!req.file) return res.status(400).json({ message: "File audio wajib diunggah" });

        // Simpan path relatif ke database
        const file_path = `/uploads/audio/${req.file.filename}`;
        const newTrack = await AudioTrack.create({ title, category, file_path });
        
        res.status(201).json(newTrack);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteTrack = async (req, res) => {
    try {
        const { id } = req.params;
        const track = await AudioTrack.findByPk(id);
        if (!track) return res.status(404).json({ message: "Track tidak ditemukan" });

        // Hapus file fisik dari folder
        const fullPath = path.join(__dirname, '..', track.file_path);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);

        await track.destroy();
        res.json({ message: "Track berhasil dihapus" });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getTracks, addTrack, deleteTrack, upload };