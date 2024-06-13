const { Router } = require('express')
const { ValidationError } = require('sequelize')

const {Course, CourseClientFields} = require('../models/course');

const { requireAuthentication } = require('../lib/auth')

const router = Router()

/*
 * GET /courses
 * Route to fetch list of courses
 */
router.get('/', async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const { count, rows } = await Course.findAndCountAll({
            offset: (page - 1) * limit,
            limit: parseInt(limit)
        });
        res.json({
            courses: rows,
            totalCourses: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        next(error)
    }
});

/*
 * POST /courses
 * Route to create new course
 */
router.post('/', requireAuthentication, async (req, res, next) => {
    if (req.role !== 'admin') {
        res.status(403).send({
            error: "Not authorized to access the specified resource"
        })
    } else {
        try {
            const course = await Course.create(req.body, CourseClientFields);
            res.status(201).json(course);
        } catch (error) {
            if (error instanceof ValidationError) {
                res.status(400).send({ error: error.message })
            } else {
                next(error)
            }
        }
    }
});

/*
 * GET /courses/{id}
 * Route to fetch info of specific course
 */
router.get('/:id', async (req, res, next) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (course) {
            res.json(course);
        } else {
            next()
        }
    } catch (error) {
        next(error)
    }
});

/*
 * PATCH /courses/{id}
 * Route to update info of specific course
 */
router.patch('/:id', requireAuthentication, async (req, res, next) => {
    // first verify that user is authorized to access resource
    let authorized = false
    if (req.role === 'admin' ) {
        authorized = true
    } else if (req.role == 'instructor') {
        if (await Course.findOne({ where: { id: req.params.id, instructorId: req.user }}))
            authorized = true
    }

    if (authorized) {
        try {
            const updated = await Course.update(req.body, {
                where: { id: req.params.id }
            });
            if (updated[0] > 0) {
                res.json(await Course.findByPk(req.params.id));
            } else {
                next()
            }
        } catch (error) {
            if (error instanceof ValidationError) {
                res.status(400).send({ error: error.message })
            } else {
                next(error)
            }
        }
    } else {
        res.status(403).send({
            error: "Not authorized to access the specified resource"
        })
    }
});


/*
 * DELETE /courses/{id}
 * Route to delete course
 */
router.delete('/:id', requireAuthentication, async (req, res, next) => {
    if (req.role !== 'admin') {
        res.status(403).send({
            error: "Not authorized to access the specified resource"
        })
    } else {
        try {
            const deleted = await Course.destroy({
                where: { id: req.params.id }
            });
            if (deleted) {
                res.status(204).send();
            } else {
                next()
            }
        } catch (error) {
            next(error)
        }
    }
});

module.exports = router