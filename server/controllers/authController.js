const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const trycatch = require('../utils/trycatch');
const AppError = require('../utils/appError');

const signToken = function (id) {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.register = trycatch(async (req, res) => {
  const { name, email, password } = req.body;
  const newUser = await User.create({ name, email, password });

  res.status(201).json({
    status: 'success',
    data: newUser.toJSON(),
  });
});

exports.login = trycatch(async (req, res, next) => {
  const { email, password } = req.body;
  // 1)確認使用者是否輸入email和password
  if (!email || !password) {
    return next(new AppError('please provide email & pasword!', 400));
  }
  // 2)確認輸入的內容是否存在，如果有錯給錯誤訊息
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password, user.password))) {
    //  先執行查詢，如果有用戶才會進行比較密碼的動作，否則不會多一個步驟
    return next(new AppError('Incorrect email OR pasword!', 401));
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.updateUser = trycatch(async (req, res) => {});
