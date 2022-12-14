const AppError = require('../utils/AppError');
const config = require('../config');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const duplicateKeyErrorDB = err => {
  console.log(err);
  const message = `${Object.keys(err.keyPattern)} duplicate Key : ${Object.keys(err.keyPattern)}`;
  return new AppError(message, 400);
};

const validationErrorDB = err => {
  console.log(err);
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const jwtError = () => {
  return new AppError('Invalid token. Please login again', 401);
};

const tokenExpiredError = () => {
  return new AppError('Token Expired. Please login again', 401);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // 在開發環境下錯誤訊息盡可能多
  if (config.env === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
    //在用戶環境下錯誤訊息盡可能簡單
  } else if (config.env === 'production') {
    // 這裡的錯誤是mongoose發出的:
    // 1)轉換數值失敗
    let copyError = Object.assign(err); //替appError做淺拷貝
    if (copyError.constructor.name === 'CastError') {
      copyError = handleCastErrorDB(copyError);
    }

    // 2)創建重複名稱
    if (copyError.code === 11000) {
      copyError = duplicateKeyErrorDB(copyError);
    }

    // 3)驗證錯誤
    if (copyError.constructor.name === 'ValidationError') {
      copyError = validationErrorDB(copyError);
    }

    //JWT驗證錯誤
    if (copyError.name === 'JsonWebTokenError') {
      copyError = jwtError();
    }

    //JWT過期
    if (copyError.name === 'TokenExpiredError') {
      copyError = tokenExpiredError();
    }

    // 這裡的錯誤是用戶操作錯誤所導致的
    if (copyError.isOperational) {
      res.status(copyError.statusCode).json({
        status: copyError.status,
        message: copyError.message,
      });
      // 這裡的錯誤是編程錯誤或一些未知錯誤:我們不想給用戶太多細節
    } else {
      // log error
      console.error(`ERROR💥:`, err);
      //send message to client
      res.status(500).json({
        status: 'error',
        message: 'something went wrong!',
      });
    }
  }
};
