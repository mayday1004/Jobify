const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 20,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: [true, 'This email has already been used'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  location: {
    type: String,
    trim: true,
    maxlength: 20,
    default: 'Taichung',
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    // mongoose:Document.prototype.isModified() 送進來的資料password有異動就會回傳true
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (originPassword, hashedPassword) {
  return await bcrypt.compare(originPassword, hashedPassword);
};

userSchema.methods.signToken = function () {
  return jwt.sign({ userId: this._id }, config.jwtSecret, {
    expiresIn: config.jwtMaxAge,
  });
};

// 不想res一些屬性給用戶看到
userSchema.methods.toJSON = function () {
  const sentUserData = this.toObject();
  delete sentUserData.password;
  delete sentUserData.__v;
  delete sentUserData._id;
  return sentUserData;
};

const User = mongoose.model('user', userSchema);

module.exports = User;
