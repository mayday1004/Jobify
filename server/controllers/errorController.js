module.exports = (err, req, res, next) => {
  // 把app.js的錯誤處理中間層複製過來
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
