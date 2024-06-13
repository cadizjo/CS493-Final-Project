const { DataTypes } = require('sequelize')

const sequelize = require('../lib/sequelize')
const { Submission } = require('./submission')

const Assignment = sequelize.define('assignment', {
    title: { type: DataTypes.STRING, allowNull: false },
    points: { type: DataTypes.INTEGER, allowNull: false },
    due: { type: DataTypes.DATE }
})

exports.Assignment = Assignment

/*
 * Set up one-to-many relationship between Assignment and Submission.
 */
Assignment.hasMany(Submission, { 
    foreignKey: { 
      name: "assignmentId",
      allowNull: false 
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
})
Submission.belongsTo(Assignment)

/*
 * Export an array containing the names of fields the client is allowed to set
 * on assignments.
 */
exports.AssignmentClientFields = [
    'courseId',
    'title',
    'points',
    'due'
]