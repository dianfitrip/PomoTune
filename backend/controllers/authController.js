const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) return res.status(400).json({ message: "Username sudah terdaftar!" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Simpan user baru
        const newUser = await User.create({ username, password: hashedPassword });
        
        // Langsung buat token agar user bisa otomatis login
        const token = jwt.sign(
            { id: newUser.id, username: newUser.username }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.status(201).json({ 
            message: "Registrasi berhasil!",
            token: token,
            user: { id: newUser.id, username: newUser.username }
        });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(400).json({ message: "Username tidak ditemukan!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Password salah!" });

        const token = jwt.sign(
            { id: user.id, username: user.username }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.json({
            message: "Login berhasil!",
            token: token,
            user: { id: user.id, username: user.username }
        });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
    }
};

const changePassword = async (req, res) => {
    try {
        console.log("\n=== MEMULAI PROSES UBAH PASSWORD ===");
        const userId = req.user.id; 
        const { oldPassword, newPassword } = req.body;
        console.log("1. UserID dari token:", userId);

        const user = await User.findOne({ where: { id: userId } }); 
        if (!user) {
            console.log("2. Batal: User tidak ditemukan di Database.");
            return res.status(404).json({ message: "Sesi tidak valid, pengguna tidak ditemukan." });
        }
        console.log("2. User ditemukan:", user.username);

        // Cek kecocokan password lama
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            console.log("3. Batal: Password lama salah!");
            return res.status(400).json({ message: "Kata sandi lama yang Anda masukkan salah!" });
        }
        console.log("3. Password lama cocok!");

        // Hash password baru
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        console.log("4. Berhasil menghash password baru.");

        // Lakukan pembaruan langsung ke database
        const [updatedRows] = await User.update(
            { password: hashedPassword },
            { where: { id: userId } }
        );

        console.log("5. SUKSES: Password baru tersimpan di database.");
        res.json({ message: "Kata sandi berhasil diubah!" });
    } catch (error) {
        console.error("ERROR saat mengubah password:", error); 
        res.status(500).json({ message: "Kesalahan server: " + error.message });
    }
};

module.exports = { register, login, changePassword };