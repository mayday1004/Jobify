const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
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

// 不想res一些屬性給用戶看到
userSchema.methods.toJSON = function () {
  const sentUserData = this.toObject();
  delete sentUserData.password;
  delete sentUserData.__v;
  return sentUserData;
};

const User = mongoose.model('user', userSchema);

module.exports = User;
