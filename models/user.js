const { DataTypes } = require('sequelize')

const sequelize = require('../lib/sequelize')
const { Course } = require('./courses')
const { Submission } = require('./submissions')

const bcrypt = require('bcryptjs')

const User = sequelize.define('user', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue('password', bcrypt.hashSync(value, 8))
        }
    },
    role: {
        type: DataTypes.STRING, 
        allowNull: false, 
        validate: {
            isIn: [['admin', 'instructor', 'student']]
        }
    }
})

exports.User = User

/*
 * Set up one-to-many relationship between User (instructor) and Course.
 */
User.hasMany(Course, { 
    foreignKey: { 
      name: "instructorId",
      allowNull: false 
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
})
Course.belongsTo(User, {
    foreignKey: { 
      name: "instructorId",
      allowNull: false 
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
})

/*
 * Set up one-to-many relationship between User (student) and Submission.
 */
User.hasMany(Submission, { 
    foreignKey: { 
      name: "studentId",
      allowNull: false 
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
})
Submission.belongsTo(User, {
    foreignKey: { 
      name: "studentId",
      allowNull: false 
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
})

/*
 * Export an array containing the names of fields the client is allowed to set
 * on users.
 */
exports.UserClientFields = [
    'name',
    'email',
    'password',
    'role'
]

exports.validateCredentials = async function (email, password) {
    const user = await User.findOne({ where: { email: email } })
    return user && await bcrypt.compare(password, user.password)
}