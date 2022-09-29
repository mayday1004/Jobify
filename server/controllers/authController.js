const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const trycatch = require('../utils/trycatch');
const AppError = require('../utils/appError');

exports.register = trycatch(async (req, res) => {
  const { name, email, password, location } = req.body;
  const newUser = await User.create({ name, email, password, location });

  const token = newUser.signToken();
  res.status(201).json({
    status: 'success',
    token,
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
  res.status(200).json({
    status: 'success',
    token,
    user: user.toJSON(),
  });
});

exports.protect = trycatch(async (req, res, next) => {
  // 1) Getting token and check of it's there
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please login to get access.', 401));
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token does no longer exist.', 401));
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.logout = (req, res) => {
  res.cookie('token', '', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  req.headers.authorization.split(' ')[1] = '';
  res.status(200).json({ status: 'success' });
};

exports.updateUser = trycatch(async (req, res) => {
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

  // various setups
  // in this case only id
  // if other properties included, must re-generate

  const token = user.signToken();

  res.status(200).json({
    status: 'success',
    token,
    user: user.toJSON(),
  });
});
