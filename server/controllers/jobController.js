const mongoose = require('mongoose');
const moment = require('moment');
const Job = require('../models/jobModel');
const trycatch = require('../utils/trycatch');
const AppError = require('../utils/appError');
const isAuthorizedJob = require('../utils/unauthorizedJob');

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
  let stats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.id) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]); //[{"_id": "pending","count": 25},{"_id": "declined","count": 29},{"_id": "interview","count": 21}]

  // make stats => {"interview": 21,"pending": 25,"declined": 29}
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.id) } },
    {
      $group: {
        _id: {
          year: {
            $year: '$createdAt',
          },
          month: {
            $month: '$createdAt',
          },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications
    .map(item => {
      const {
        _id: { year, month },
        count,
      } = item;
      // accepts 0-11
      const date = moment()
        .month(month - 1)
        .year(year)
        .format('MMM Y');
      return { date, count };
    })
    .reverse();

  res.status(200).json({
    status: 'success',
    defaultStats,
    monthlyApplications,
  });
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
  isAuthorizedJob(req.user.id, job.createdBy._id);

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
  const job = await Job.findById(req.params.id);

  if (!job) {
    next(new AppError(`No job with id ${req.params.id}`, 400));
  }

  // 避免有人刪除別人的job
  isAuthorizedJob(req.user.id, job.createdBy._id);

  await Job.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
  });
});
