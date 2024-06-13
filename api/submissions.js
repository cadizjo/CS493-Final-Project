const { Router } = require('express')
const { Submission } = require('../models/submission');
const { Assignment } = require('../models/assignment');
const { Course } = require('../models/course');

const { requireAuthentication } = require('../lib/auth')

const router = Router()

router.patch('/:submissionId', requireAuthentication, async (req, res, next) => {
    const { submissionId } = req.params
    let result = null

    // first verify that user is authorized to access resource
    let authorized = false
    if (req.role === 'admin' ) {
        authorized = true
    } else if (req.role === 'instructor') {
        const submission = await Submission.findByPk(submissionId, { include: [ Assignment ] })
        if ( submission && await Course.findByPk(submission.assignmentId.courseId).instructorId == req.user) {
            authorized = true
        }
    }
    
    if (authorized) {
        try {
            result = await Submission.findByPk(submissionId)
            if (result == null) {
                next()
            } else {
                result = await Submission.update(req.body, {
                    where: { id: submissionId },
                    fields: [
                        'assignmentId',
                        'studentId',
                        'timestamp',
                        'grade',
                        'file'
                    ]
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
    } else {
        res.status(403).send({
            error: "Not authorized to access the specified resource"
        })
    }
});

module.exports = router

/*
 *  Not needed since media middleware function in server.js suffices
 */

// router.get('media/submissions/:filename', async (req, res) => {
//     try {
//         const filename = req.params.filename;
//         const submission = await Submission.findOne({
//             where: { filename: filename }
//         });
//         if (!submission) {
//             return res.status(404).send('Submission not found');
//         }

//         // Define the file path
//         const filePath = path.join(__dirname, 'uploads', submission.path);

//         // Send the file to the client
//         res.download(filePath, filename, (err) => {
//             if (err) {
//                 res.status(500).send('Could not download the file. Try again later.');
//             }
//         });
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// });