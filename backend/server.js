require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Pendaftaran Routes
app.use('/api', authRoutes);

// Sinkronisasi Database
sequelize.sync().then(() => {
    console.log("Database Terhubung & Tabel Siap");
}).catch(err => {
    console.error("Gagal menghubungkan ke database:", err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server Backend berjalan di http://localhost:${PORT}`);
});