const AppError = require('./AppError');

const isAuthorizedJob = (UserId, createdById) => {
  if (createdById.toString() !== UserId) {
    return new AppError('Unauthorized Job', 401);
  }
};

module.exports = isAuthorizedJob;
