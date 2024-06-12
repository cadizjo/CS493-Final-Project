const { DataTypes } = require('sequelize')

const sequelize = require('../lib/sequelize')
const { Assignment } = require('./assignment')

const Course = sequelize.define('course', {
    subject: { type: DataTypes.STRING, allowNull: false },
    number: { type: DataTypes.STRING, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    term: { type: DataTypes.STRING, allowNull: false },
    instructorId: { type: DataTypes.INTEGER, allowNull: false }
})

exports.Course = Course

/*
 * Set up one-to-many relationship between Course and Assignment.
 */
Course.hasMany(Assignment, { 
    foreignKey: { 
      name: "courseId",
      allowNull: false 
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
})
Assignment.belongsTo(Course)

/*
 * Export an array containing the names of fields the client is allowed to set
 * on courses.
 */
exports.CourseClientFields = [
    'subject',
    'number',
    'title',
    'term',
    'instructorId'
]