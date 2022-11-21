const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const trycatch = require('../utils/trycatch');
const AppError = require('../utils/AppError');
const config = require('../config');

exports.register = trycatch(async (req, res) => {
  const { name, email, password, location } = req.body;
  const newUser = await User.create({ name, email, password, location });

  const token = newUser.signToken();
  res
    .status(201)
    .cookie('token', token, { maxAge: config.cookieMaxAge, signed: true })
    .cookie('user', newUser.toJSON(), { maxAge: config.cookieMaxAge, signed: true })
    .json({
      status: 'success',
      user: newUser.toJSON(),
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
  const token = user.signToken();

  res
    .status(200)
    .cookie('token', token, { maxAge: config.cookieMaxAge, signed: true })
    .cookie('user', user.toJSON(), { maxAge: config.cookieMaxAge, signed: true })
    .json({
      status: 'success',
      user: user.toJSON(),
    });
});

exports.protect = trycatch(async (req, res, next) => {
  // 1) Getting token and check of it's there

  const token = req.signedCookies.token;

  if (!token) {
    return next(new AppError('You are not logged in! Please login to get access.', 401));
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, config.jwtSecret);
  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token does no longer exist.', 401));
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.guestRestrict = (req, res, next) => {
  if (req.user._id.toString() === '6332e87798463253f089406b') {
    return next(new AppError('You do not have permission to perform this action', 403));
  }

  next();
};

exports.logout = (req, res) => {
  req.user = null;
  res.status(200).clearCookie('token').clearCookie('user').json({ status: 'success' });
};

exports.updateUser = trycatch(async (req, res, next) => {
  const { email, name, location, password } = req.body;

  if (password) {
    const user = await User.findById(req.user._id);
    user.password = password;
    await user.save();
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      email,
      name,
      location,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  const token = user.signToken();

  res
    .status(200)
    .cookie('token', token, { maxAge: config.cookieMaxAge, signed: true })
    .cookie('user', user.toJSON(), { maxAge: config.cookieMaxAge, signed: true })
    .json({
      status: 'success',
      user: user.toJSON(),
    });
});
