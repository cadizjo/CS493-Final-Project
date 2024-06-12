const { DataTypes } = require('sequelize')

const sequelize = require('../lib/sequelize')


const Assignment = sequelize.define('assignment', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: { type: DataTypes.STRING, allowNull: false},
    points: { type: DataTypes.INTEGER},
    dueDate: { type: DataTypes.DATETIME, allowNull: false}
})

exports.Assignment = Assignment

exports.AssignmentClientFields = [
    'title',
    'points',
    'dueDate',
    'courseId'
]