const AppError = require('../utils/appError');

// 處理mongoDB錯誤
const duplicateKeyErrorDB = err => {
  const message = `${Object.keys(err.keyPattern)} duplicate Key : ${Object.values(err.keyValue)}`;
  return new AppError(message, 400);
};

const validationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  // 把app.js的錯誤處理中間層複製過來
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // 在開發環境下錯誤訊息盡可能多
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
    //在用戶環境下錯誤訊息盡可能簡單
  } else if (process.env.NODE_ENV === 'production') {
    // 這裡的錯誤是mongoose發出的:
    // 1)查詢無效ID CastError
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
