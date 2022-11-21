const express = require('express');
const authController = require('../controllers/authController');
const jobController = require('../controllers/jobController');

const router = express.Router();

router.use(authController.protect);
router.route('/').get(jobController.getAllJobs).post(authController.guestRestrict, jobController.createJob);
// place before :id
router.route('/stats').get(jobController.showStats);
router
  .route('/:id')
  .delete(authController.guestRestrict, jobController.deleteJob)
  .patch(authController.guestRestrict, jobController.updateJob);

module.exports = router;
