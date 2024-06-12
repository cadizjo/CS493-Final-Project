const { Router } = require('express')

const { Assignment, AssignmentClientFields} = require('../models/assignment')

const router = Router()

router.get('/courses/:id/assignments', async (req, res) => {
    try {
        const assignments = await Assignment.findAll({
            where: { courseId: req.params.id }
        });
        res.json(assignments);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


router.post('/assignments', async (req, res) => {
    try {
        const assignment = await Assignment.create(req.body, AssignmentClientFields);
        res.status(201).json(assignment);
    } catch (error) {
        res.status(400).send(error.message);
    }
});


router.patch('/assignments/:assignmentId', async (req, res) => {
    try {
        const updated = await Assignment.update(req.body, {
            where: { id: req.params.assignmentId }
        });
        if (updated[0] > 0) {
            res.json(await Assignment.findByPk(req.params.assignmentId));
        } else {
            res.status(404).send('Assignment not found');
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});


router.delete('/assignments/:assignmentId', async (req, res) => {
    try {
        const deleted = await Assignment.destroy({
            where: { id: req.params.assignmentId }
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).send('Assignment not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});