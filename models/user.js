const mongoose = require('mongoose');

const validator = require('validator');
const { linkRegular } = require('../utils/consts');

const userSchema = new mongoose.Schema({
  name: {
    default: 'Жак-Ив Кусто',
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    default: 'Исследователь',
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    required: true,
    type: String,
    match: linkRegular,
  },
  email: {
    required: [true, 'Поле email должно быть обязательно заполнено'],
    unique: true,
    type: String,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Пожалуйста введите правильный E-mail',
    },
  },
  password: {
    required: [true, 'Поле password должно быть обязательно заполнено'],
    type: String,
    select: false,
  },
});

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('user', userSchema);
