/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
/* eslint-disable no-multiple-empty-lines */
const User = require('../models/user');

const { notFoundError, validationError, defaultError } = require('../errors/errors');

const getUsers = (req, res) => {
  User.find({})
    .populate(['name', 'about', 'avatar'])
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(validationError).send({ message: 'Переданные данные некорректны', err: err.message });
      }
      if (err.message === 'Not Found') {
        return res.status(notFoundError).send({ message: 'Объект не найден', err: err.message });
      }
      return res.status(defaultError).send({ message: 'Произошла неизвестная ошибка сервера', err: err.message });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => new Error('Not Found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(validationError).send({ message: 'Переданные данные некорректны', err: err.message });
      }
      if (err.message === 'Not Found') {
        return res.status(notFoundError).send({ message: 'Объект не найден', err: err.message });
      }
      return res.status(defaultError).send({ message: 'Произошла неизвестная ошибка сервера', err: err.message });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(validationError).send({ message: 'Переданные данные некорректны' });
      }
      if (err.message === 'Not Found') {
        return res.status(notFoundError).send({ message: 'Объект не найден' });
      }
      return res.status(defaultError).send({ message: 'Произошла неизвестная ошибка сервера' });
    });
};

const updateProfileUser = (req, res) => {
  const { name, about } = req.body;
  const owner = req.user._id;
  User.findByIdAndUpdate({ name, about }, owner, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(validationError).send({ message: 'Переданные данные некорректны' });
      }
      if (err.message === 'Not Found') {
        return res.status(notFoundError).send({ message: 'Объект не найден' });
      }
      return res.status(defaultError).send({ message: 'Произошла неизвестная ошибка сервера' });
    });
};

const updateAvatarUser = (req, res) => {
  const { avatar } = req.body;
  const owner = req.user._id;
  User.findByIdAndUpdate({ avatar }, owner, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(validationError).send({ message: 'Переданные данные некорректны' });
      }
      if (err.message === 'Not Found') {
        return res.status(notFoundError).send({ message: 'Объект не найден' });
      }
      return res.status(defaultError).send({ message: 'Произошла неизвестная ошибка сервера' });
    });
};

module.exports = {
  createUser,
  getUserById,
  getUsers,
  updateProfileUser,
  updateAvatarUser,
};
