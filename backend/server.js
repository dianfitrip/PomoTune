require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // Tambahkan ini
const sequelize = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const audioRoutes = require('./routes/audioRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const progressRoutes = require('./routes/progressRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Izinkan frontend mengakses file di folder uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/audio', audioRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/progress', progressRoutes);

sequelize.sync({ alter: true }).then(() => {
    console.log("Database Terhubung & Tabel Siap");
}).catch(err => {
    console.error("Gagal menghubungkan ke database:", err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server Backend berjalan di http://localhost:${PORT}`);
});