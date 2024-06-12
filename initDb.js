/*
 * This file contains a simple script to populate the database with initial
 * data from the files in the data/ directory.
 * 
 * run with node initDb.js
 */

require("dotenv").config()
const sequelize = require('./lib/sequelize')
const { User, UserClientFields } = require('./models/user')

const userData = require('./data/users.json')

sequelize.sync().then(async function () {
  await User.bulkCreate(userData, { fields: UserClientFields })
})
