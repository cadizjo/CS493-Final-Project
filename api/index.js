const { Router } = require('express')

const usersRouter = require('./users')
const coursesRouter = require('./courses')

const router = Router()

router.use('/users', usersRouter)
router.use('/courses', coursesRouter)

module.exports = router
