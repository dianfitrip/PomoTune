// backend/models/Task.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User'); 

const Task = sequelize.define('Task', {
    text: {
        type: DataTypes.STRING,
        allowNull: false
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    category: {
        type: DataTypes.STRING,
        defaultValue: 'Umum'
    },
    priority: {
        type: DataTypes.ENUM('Tinggi', 'Sedang', 'Rendah'),
        defaultValue: 'Sedang'
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'tasks',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

User.hasMany(Task, { foreignKey: { name: 'user_id', allowNull: false }, onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: { name: 'user_id', allowNull: false }, onDelete: 'CASCADE' });

module.exports = Task;