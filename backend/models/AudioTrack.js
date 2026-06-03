const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AudioTrack = sequelize.define('AudioTrack', {
    title: { type: DataTypes.STRING, allowNull: false },
    file_path: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.ENUM('binaural', 'ambient', 'campuran'), allowNull: false }
}, {
    tableName: 'audio_tracks',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = AudioTrack;