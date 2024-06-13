const { Router } = require('express')
const upload = require("../lib/multer")

const { Assignment, AssignmentClientFields} = require('../models/assignment')
const { Submission, SubmissionClientFields } = require('../models/submission')
const { ValidationError } = require('sequelize')

const router = Router()

router.post('/', async (req, res, next) => {
    try {
        const assignment = await Assignment.create(req.body, AssignmentClientFields);
        res.status(201).send({ id: assignment.id })
    } catch (e) {
        if (e instanceof ValidationError) {
            res.status(400).send({ error: e.message })
        } else {
            next(e)
        }
    }
})

router.get('/:assignmentId', async (req, res, next) => {
    const { assignmentId } = req.params
    try {
        const assignment = await Assignment.findByPk(assignmentId)
        if (assignment) {
            res.status(200).send(assignment)
        } else {
            next()
        }
    } catch (e) {
        next(e)
    }
});


router.patch('/:assignmentId', async (req, res, next) => {
    const { assignmentId } = req.params
    let result = null
    try {
        result = await Assignment.findByPk(assignmentId)
        if (result == null) {
            next()
        } else {
            result = await Assignment.update(req.body, {
                where: { id: assignmentId },
                fields: AssignmentClientFields
            })
            if (result[0] > 0) {
                res.status(204).send()
            } else {
                next()
            }
        }
    } catch (e) {
        next(e)
    }
});


router.delete('/:assignmentId', async (req, res, next) => {
    const { assignmentId } = req.params
    let result = null
    try {
        result = await Assignment.findByPk(assignmentId)
        if (result == null) {
            next()
        } else {
            result = await Assignment.destroy({ where: { id: assignmentId } })
            if (result > 0) {
                res.status(204).send()
            } else {
                next()
            }
        }
    } catch (e) {
        next(e)
    }
});

router.get('/:assignmentId/submissions', async (req, res, next) => {
    // requires authentication
    const { assignmentId } = req.params
    const { studentId } = req.query

    const filterConditions = { assignmentId: assignmentId }
    if (studentId) { 
        filterConditions.studentId = studentId 
    }

    const numPerPage = 10
    const totalRows = await Submission.count({
        where: filterConditions
    })
    const lastPage = Math.ceil(totalRows / numPerPage)

    let page = parseInt(req.query.page) || 1
    page = page < 1 ? 1 : page
    page = page > lastPage ? lastPage : page

    const offset = (page - 1) * numPerPage

    try {
        const result = await Submission.findAndCountAll({
            where: filterConditions,
            limit: numPerPage,
            offset: offset
        })

        /*
         * Ready submissions response body
         */
        let submissions = []
        for (let submission of result.rows) {
            const { filename, path, contentType, ...submissionMetadata } = submission.get({ plain: true }) // exclude filename, path, contentType in response

            const file = `/media/submissions/${filename}`

            submissions.push({
                ...submissionMetadata,
                file: file
            })
        }

        /*
         * Generate HATEOAS links for surrounding pages.
         */
        const links = {}
        if (page < lastPage) {
            links.nextPage = `/assignments/${assignmentId}/submissions?page=${page + 1}`
            links.lastPage = `/assignments/${assignmentId}/submissions?page=${lastPage}`
        }
        if (page > 1) {
            links.prevPage = `/assignments/${assignmentId}/submissions?page=${page - 1}`
            links.firstPage = `/assignments/${assignmentId}/submissions?page=1`
        }
        if (studentId) {
            for (let key in links) { // loop thru each property of the 'links' object
                links[key] += `&studentId=${studentId}`
            }
        }

        /*
         * Construct and send response.
         */
        res.status(200).send({
            submissions: submissions,
            pageNumber: page,
            totalPages: lastPage,
            pageSize: numPerPage,
            totalCount: result.count,
            links: links
        })
    } catch (e) {
        next(e)
    }
})

router.post('/:assignmentId/submissions', upload.single("file"), async (req, res, next) => {
    // requires authentication
    const { assignmentId } = req.params
    if (req.file && req.body) {
        try {
            const submission = await Submission.create(
                {
                    filename: req.file.filename,
                    path: req.file.path,
                    contentType: req.file.mimetype,
                    assignmentId: assignmentId,
                    timestamp: new Date().toISOString(),
                    ...req.body
                },
                SubmissionClientFields
            )
            res.status(201).send({ id: submission.id })

        } catch(e) {
            if (e instanceof ValidationError) {
                res.status(400).send({
                    error: "Request needs assignmentId and studentId"
                })
            } else {
                next(e)
            }
        }
    } else {
        res.status(400).send({
            error: "Request needs a valid 'file'"
        })
    }
})

module.exports = router