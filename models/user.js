const mongoose = require('mongoose');

// eslint-disable-next-line import/no-extraneous-dependencies
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    default: 'Жак-Ив-Кусто',
    required: [true, 'Поле name должно быть обязательно заполнено'],
    // required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    default: 'Исследователь',
    required: [true, 'Поле about должно быть обязательно заполнено'],
    // required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    default: 'https://img.icons8.com/?size=512&id=39590&format=png',
    required: [true, 'Поле avatar должно быть обязательно заполнено'],
    // required: true,
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
  },
});

module.exports = mongoose.model('user', userSchema);
