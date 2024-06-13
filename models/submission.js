const { DataTypes } = require('sequelize')

const sequelize = require('../lib/sequelize')

const Submission = sequelize.define('submission', {
    timestamp: { type: DataTypes.DATE, allowNull: false },
    grade: { type: DataTypes.FLOAT, allowNull: true },
    filename: { type: DataTypes.STRING, allowNull: false },
    path: { type: DataTypes.STRING, allowNull: false },
    contentType: { type: DataTypes.STRING, allowNull: false }
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