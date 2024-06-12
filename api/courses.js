const { Router } = require('express')

const {Course, CourseClientFields} = require('../models/course');

const router = Router()

router.get('/courses', async (req, res) => {
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
        res.status(500).send(error.message);
    }
});


router.get('/courses/:id', async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (course) {
            res.json(course);
        } else {
            res.status(404).send('Course not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});


router.post('/courses', async (req, res) => {
    try {
        const course = await Course.create(req.body, CourseClientFields);
        res.status(201).json(course);
    } catch (error) {
        res.status(400).send(error.message);
    }
});


router.patch('/courses/:id', async (req, res) => {
    try {
        const updated = await Course.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated[0] > 0) {
            res.json(await Course.findByPk(req.params.id));
        } else {
            res.status(404).send('Course not found');
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});


router.delete('/courses/:id', async (req, res) => {
    try {
        const deleted = await Course.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).send('Course not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});