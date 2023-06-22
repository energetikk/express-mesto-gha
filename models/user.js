const mongoose = require('mongoose');

// eslint-disable-next-line import/no-extraneous-dependencies
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    default: 'Жак-Ив-Кусто',
    // required: [true, 'Поле name должно быть обязательно заполнено'],
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    default: 'Исследователь',
    // required: [true, 'Поле about должно быть обязательно заполнено'],
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    // required: [true, 'Поле avatar должно быть обязательно заполнено'],
    required: true,
    type: String,
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
    // required: true,
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
