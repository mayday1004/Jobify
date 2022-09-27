const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Please provide company'],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, 'Please provide position'],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ['interview', 'declined', 'pending'],
      default: 'pending',
    },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'remote', 'internship'],
      default: 'full-time',
    },
    jobLocation: {
      type: String,
      default: 'my city',
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
      required: [true, 'Please provide user'],
    },
  },
  { timestamps: true } // Mongoose 會添加type:Date 的 createdAt & updatedAt的屬性
);

JobSchema.pre(/save|^find/, function (next) {
  this.populate({
    path: 'createdBy',
    select: 'name',
  });
  next();
});

JobSchema.methods.toJSON = function () {
  const sentJobData = this.toObject();
  delete sentJobData.__v;
  return sentJobData;
};

module.exports = mongoose.model('Job', JobSchema);
