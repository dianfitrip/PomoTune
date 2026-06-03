const FocusSession = require('../models/FocusSession');

const saveSession = async (req, res) => {
    try {
        const { task_id, audio_id, duration_minutes, status } = req.body;
        
        const newSession = await FocusSession.create({
            user_id: req.user.id,
            task_id: task_id || null,
            audio_id: audio_id || null,
            duration_minutes,
            status: status || 'completed'
        });
        
        res.status(201).json({ message: "Sesi berhasil disimpan", session: newSession });
    } catch (error) {
        res.status(500).json({ message: "Gagal menyimpan sesi", error: error.message });
    }
};

module.exports = { saveSession };