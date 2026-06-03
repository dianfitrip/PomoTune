require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(cors());
app.use(express.json());

// 1. INISIALISASI ORM SEQUELIZE
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false, // Matikan log SQL di terminal agar outputnya bersih
    }
);

// 2. DEFINISI MODEL (Tabel Users)
// Sequelize akan otomatis membuat tabel ini jika belum ada di database
const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'users',
    timestamps: true, // Otomatis mengurus kolom createdAt
    createdAt: 'created_at',
    updatedAt: false  // Kita belum butuh kolom updatedAt saat ini
});

// 3. SINKRONISASI DATABASE
sequelize.sync().then(() => {
    console.log("✅ Database Terhubung & Tabel Users (ORM) Siap");
}).catch(err => {
    console.error("❌ Gagal menghubungkan ke database:", err);
});

// --- API ROUTES ---

// 1. REGISTER
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Cari user menggunakan metode ORM (findOne)
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "Email sudah terdaftar!" });

        // Enkripsi Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Simpan ke Database menggunakan metode ORM (create)
        await User.create({ name, email, password: hashedPassword });
        
        res.status(201).json({ message: "Registrasi berhasil! Silakan login." });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
    }
});

// 2. LOGIN
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Cari User
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: "Email tidak ditemukan!" });

        // Cek Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Password salah!" });

        // Buat Token Login
        const token = jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.json({
            message: "Login berhasil!",
            token: token,
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
    }
});

// Jalankan Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server Backend berjalan di http://localhost:${PORT}`);
});