const AppError = require('../utils/appError');

const isAuthorizedJob = (UserId, createdById) => {
  if (createdById.toString() !== UserId) {
    return new AppError('Unauthorized Job', 401);
  }
};

module.exports = isAuthorizedJob;
