// backend/controllers/taskController.js
const Task = require('../models/Task');

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll({ where: { user_id: req.user.id } });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil tugas", error: error.message });
    }
};

const addTask = async (req, res) => {
    try {
        const { text, category, priority, deadline } = req.body;
        const newTask = await Task.create({ 
            text, 
            category: category || 'Umum',
            priority: priority || 'Sedang',
            deadline: deadline || null,
            user_id: req.user.id 
        });
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: "Gagal menambah tugas", error: error.message });
    }
};

const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { text, completed, category, priority, deadline } = req.body;
        
        const task = await Task.findOne({ where: { id, user_id: req.user.id } });
        if (!task) return res.status(404).json({ message: "Tugas tidak ditemukan" });

        if (text !== undefined) task.text = text;
        if (completed !== undefined) task.completed = completed;
        if (category !== undefined) task.category = category;
        if (priority !== undefined) task.priority = priority;
        if (deadline !== undefined) task.deadline = deadline;
        
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Gagal memperbarui tugas", error: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findOne({ where: { id, user_id: req.user.id } });
        if (!task) return res.status(404).json({ message: "Tugas tidak ditemukan" });

        await task.destroy();
        res.json({ message: "Tugas berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus tugas", error: error.message });
    }
};

module.exports = { getTasks, addTask, updateTask, deleteTask };