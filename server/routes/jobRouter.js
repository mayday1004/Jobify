const express = require('express');
const authController = require('../controllers/authController');
const jobController = require('../controllers/jobController');

const router = express.Router();

router.use(authController.protect);
router.route('/').get(jobController.getAllJobs).post(jobController.createJob);
// place before :id
router.route('/stats').get(jobController.showStats);
router.route('/:id').delete(jobController.deleteJob).patch(jobController.updateJob);

module.exports = router;
