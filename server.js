require('dotenv').config()

const express = require('express')
const morgan = require('morgan')

const api = require('./api')
const sequelize = require('./lib/sequelize')
const { redisClient } = require('./lib/redis')

const app = express()
const port = process.env.PORT || 8000

app.use(morgan('dev'))

app.use(express.json())

/*
 * All API routes go to api/ directory
 */
app.use('/', api)

// middleware to download static submissions in server's filesystem
app.use("/media/submissions", express.static(`${__dirname}/lib/submissions`))

/*
 * Resource not found
 */
app.use('*', function (req, res, next) {
	res.status(404).send({
		error: `Requested resource "${req.originalUrl}" does not exist`
	})
})

/*
 * Catches errors thrown from API endpoints
 */
app.use('*', function (err, req, res, next) {
	console.error("== Error:", err)
	res.status(500).send({
		error: "Server error. Please try again later."
	})
})

/*
 * Connect to MySQL and Redis server then start API server
 */
sequelize.sync().then(function () {
	redisClient.connect().then(() => {
		app.listen(port, function () {
			console.log("== Server is running on port", port)
		})
	})
})
