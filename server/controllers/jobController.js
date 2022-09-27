const Job = require('../models/jobModel');
const trycatch = require('../utils/trycatch');
const AppError = require('../utils/appError');

exports.getAllJobs = trycatch(async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.id });

  res.status(200).json({
    status: 'success',
    result: jobs.length,
    data: jobs,
  });
});

exports.createJob = trycatch(async (req, res) => {
  const { company, position } = req.body;
  const newJob = await Job.create({ company, position, createdBy: req.user.id });

  res.status(201).json({
    status: 'success',
    data: newJob.toJSON(),
  });
});

exports.showStats = trycatch(async (req, res) => {
  console.log(showStats);
});

exports.updateJob = trycatch(async (req, res) => {
  console.log(updateJob);
});

exports.deleteJob = trycatch(async (req, res) => {
  console.log(deleteJob);
});
