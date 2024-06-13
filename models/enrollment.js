const sequelize = require('../lib/sequelize')
const { User } = require('../models/user')
const { Course } = require('./course')

const Enrollment = sequelize.define('enrollment', {}, { timestamps: false });
User.belongsToMany(Course, { through: Enrollment });
Course.belongsToMany(User, { through: Enrollment });

exports.Enrollment = Enrollment