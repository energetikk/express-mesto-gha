const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  owner: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  link: {
    required: true,
    type: String,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Пожалуйста введите корректный адрес ссылки на картинку',
    },
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
    ref: 'user',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },

});

module.exports = mongoose.model('card', cardSchema);
