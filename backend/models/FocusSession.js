const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Task = require('./Task');
const AudioTrack = require('./AudioTrack');

const FocusSession = sequelize.define('FocusSession', {
    duration_minutes: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('completed', 'interrupted'),
        defaultValue: 'completed'
    }
}, {
    tableName: 'focus_sessions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

// Relasi Database
User.hasMany(FocusSession, { foreignKey: 'user_id', onDelete: 'CASCADE' });
FocusSession.belongsTo(User, { foreignKey: 'user_id' });

Task.hasMany(FocusSession, { foreignKey: 'task_id', onDelete: 'SET NULL' });
FocusSession.belongsTo(Task, { foreignKey: 'task_id' });

AudioTrack.hasMany(FocusSession, { foreignKey: 'audio_id', onDelete: 'SET NULL' });
FocusSession.belongsTo(AudioTrack, { foreignKey: 'audio_id' });

module.exports = FocusSession;