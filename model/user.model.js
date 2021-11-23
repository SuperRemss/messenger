const mongoose = require('./mongoose');
const bcrypt = require('bcrypt');
const salt = '$2b$10$uMMerxBWR8pPg8NFXLewXe';
const validators = require("../validators");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: true,
    validate: validators.usernameValidators,
  },
  password: {
    type: String,
    required: true,
    validate: validators.passwordValidators
  },
}, {timestamps: true});

userSchema.pre('save', function (next) {
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.hash(user.password, salt, function (err, hash) {
    if (err) return next(err);

    user.password = hash;
    next();
  });
});
userSchema.methods.comparePassword = function (password) {
  const user = this;
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, function (err, hash) {
      if (err) return reject(err);

      resolve(user.password === hash);
    });
  })
}
const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;