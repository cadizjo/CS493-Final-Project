const { Router } = require('express')
const { ValidationError } = require('sequelize')

const { User, UserClientFields, validateCredentials } = require('../models/user')

const { generateAuthToken, requireAuthentication } = require('../lib/auth')

const router = Router()

function requireAuthenticationForAdmin(req, res, next) {
    if (req.body.role === 'instructor' || req.body.role === 'admin') {
        requireAuthentication(req, res, next)
    } else {
        next()
    }
}

/*
 * Route to register a new user.
 */
router.post('/', requireAuthenticationForAdmin, async function (req, res, next) {
    if ((req.body.role === 'admin' || req.body.role === 'instructor') && req.role !== 'admin') {
        res.status(403).send({
            error: "Not authorized to create admin or instructor user while logged in as a user without admin privilege"
        })
    } else {
        try {
            const user = await User.create(req.body, UserClientFields)
            res.status(201).send({ id: user.id })
        } catch (e) {
            if (e instanceof ValidationError) {
                res.status(400).send({ error: e.message })
            } else {
                next(e)
            }
        }
    }
})


/*
 * Route to login.
 */
router.post('/login', async function (req, res, next) {
    try {
        const authenticated = await validateCredentials(req.body.email, req.body.password)
        if (authenticated) {
            const user = await User.findOne({ where: { email: req.body.email } })
            const token = generateAuthToken(user.id, user.role)
            res.status(200).send({
                token: token
            })
        } else {
            res.status(401).send({
                error: "Invalid authentication credentials"
            })
        }
    } catch (e) {
        next(e)
    }
})

/*
 * Route to fetch info about a specific user.
 */
router.get('/:userId', requireAuthentication, async function (req, res, next) {
    // first verify that user is authorized to access resource
    if (req.role !== 'admin' && req.user != req.params.userId) {
        res.status(403).send({
            error: "Not authorized to access the specified resource"
        })
    }
    else {
        try {
            const user = await User.findByPk(req.params.userId)
            if (user) {
                const userInfoResponse = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }

                if (user.role === 'instructor') {
                    // no implementation
                    console.log("user is instructor")
                }
                else if (user.role === 'student') {
                    // no implementation
                    console.log("user is student")
                }

                res.status(200).send(userInfoResponse)
            } else {
                next()
            }
        } catch (e) {
            next(e)
        }
    }
})

module.exports = router
