const { DataTypes } = require('sequelize')

const sequelize = require('../lib/sequelize')

const Submission = sequelize.define('submission', {
    assignmentId: { type: DataTypes.INTEGER, allowNull: false },
    studentId: { type: DataTypes.INTEGER, allowNull: false },
    timestamp: { type: DataTypes.DATE, allowNull: false },
    grade: { type: DataTypes.FLOAT, allowNull: false },
    file: { type: DataTypes.STRING, allowNull: false }
})

exports.Submission = Submission

/*
 * Export an array containing the names of fields the client is allowed to set
 * on submissions.
 */
exports.SubmissionClientFields = [
    'assignmentId',
    'studentId'
]