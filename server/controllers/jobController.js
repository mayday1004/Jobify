const Job = require('../models/jobModel');
const trycatch = require('../utils/trycatch');
const AppError = require('../utils/appError');

exports.getAllJobs = trycatch(async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.id });

  res.status(200).json({
    status: 'success',
    totalJobs: jobs.length,
    numOfPages: 1,
    jobs: jobs,
  });
});

exports.createJob = trycatch(async (req, res, next) => {
  const { company, position, jobLocation, jobType, status } = req.body;
  if (!position || !company) {
    next(new AppError('Please Provide All Values', 400));
  }
  const newJob = await Job.create({
    company,
    position,
    jobLocation,
    jobType,
    status,
    createdBy: req.user.id,
  });

  res.status(201).json({
    status: 'success',
    jobs: newJob.toJSON(),
  });
});

exports.showStats = trycatch(async (req, res) => {
  console.log(showStats);
});

exports.updateJob = trycatch(async (req, res, next) => {
  const { company, jobLocation, jobType, position, status } = req.body;
  if (!company || !position) {
    return next(new AppError('Please Provide All Values', 400));
  }

  const job = await Job.findById(req.params.id);

  if (!job) {
    next(new AppError(`No job with id ${req.params.id}`, 400));
  }

  // 避免有人修改別人的job
  if (job.createdBy._id.toString() !== req.user.id) {
    return next(new AppError('Unauthorized Job', 401));
  }

  await Job.findByIdAndUpdate(
    req.params.id,
    { company, jobLocation, jobType, position, status },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'success',
    jobs: job.toJSON(),
  });
});

exports.deleteJob = trycatch(async (req, res) => {
  console.log(deleteJob);
});
