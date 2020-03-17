const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add a email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  role: {
    type: String,
    enum: ['user', 'publisher'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt Password using bcryptjs
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Match Password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password
UserSchema.methods.getResetPasswordToken = function() {
  // Generate Token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // hash token and set to resetPasswordToken
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set Expire Token
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('User', UserSchema);
