const { Router } = require('express')

const usersRouter = require('./users')

const router = Router()

router.use('/users', usersRouter)

module.exports = router
