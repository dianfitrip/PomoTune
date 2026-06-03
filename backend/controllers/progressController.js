const Task = require('../models/Task');
const FocusSession = require('../models/FocusSession');

const getProgressStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Hitung total tugas yang sudah selesai
        const completedTasksCount = await Task.count({
            where: { user_id: userId, completed: true }
        });

        // 2. Ambil semua sesi fokus yang selesai
        const sessions = await FocusSession.findAll({
            where: { user_id: userId, status: 'completed' }
        });

        const totalSessions = sessions.length;
        const totalFocusMinutes = sessions.reduce((sum, session) => sum + session.duration_minutes, 0);

        res.json({
            totalTasksCompleted: completedTasksCount,
            totalSessions: totalSessions,
            totalFocusMinutes: totalFocusMinutes
        });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil statistik", error: error.message });
    }
};

module.exports = { getProgressStats };