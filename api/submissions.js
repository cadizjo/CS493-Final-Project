const { Router } = require('express')
const { Submission } = require('./models/submission');
const path = require('path');
const { upload } = require('../lib/multer');


Router.patch('/submissions/:id', async (req, res) => {
    const { grade } = req.body; 
    try {
        const submission = await Submission.findByPk(req.params.id);
        if (!submission) {
            return res.status(404).send('Submission not found');
        }

        // Update the grade
        submission.grade = grade;
        await submission.save();
        
        res.json(submission);
    } catch (error) {
        res.status(400).send(error.message);
    }
});


Router.get('media/submissions/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const submission = await Submission.findOne({
            where: { filename: filename }
        });
        if (!submission) {
            return res.status(404).send('Submission not found');
        }

        // Define the file path
        const filePath = path.join(__dirname, 'uploads', submission.path);

        // Send the file to the client
        res.download(filePath, filename, (err) => {
            if (err) {
                res.status(500).send('Could not download the file. Try again later.');
            }
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});