const bcrypt = require('bcryptjs');
const User = require('../models/user');

const { notFoundError, validationError, defaultError } = require('../errors/errors');

const statusOK = 201;

const getUsers = (req, res) => {
  // console.log('kkykykykykkykyky');
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      res.status(defaultError).send({ message: 'Произошла неизвестная ошибка сервера', err: err.message });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => new Error('Not Found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(validationError).send({ message: 'Передан невалидный ID', err: err.message });
      }
      if (err.message === 'Not Found') {
        return res.status(notFoundError).send({ message: 'Объект не найден', err: err.message });
      }
      return res.status(defaultError).send({ message: 'Произошла неизвестная ошибка сервера', err: err.message });
    });
};

const createUser = (req, res) => {
  // console.log('kkykykykykkykyky');
  // console.log(req.body);
  bcrypt.hash(String(req.body.password), 10)
    .then((hashedpassword) => {
      User.create({ ...req.body, password: hashedpassword })
        .then((user) => res.status(statusOK).send(user))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return res.status(validationError).send({ message: 'Переданные данные некорректны' });
          }
          return res.status(defaultError).send({ message: 'Произошла неизвестная ошибка сервера' });
        });
    });
};

const updateProfileUser = (req, res) => {
  const { name, about } = req.body;
  const owner = req.user._id;
  User.findByIdAndUpdate(owner, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(validationError).send({ message: 'Переданные данные некорректны' });
      }
      return res.status(defaultError).send({ message: 'Произошла неизвестная ошибка сервера' });
    });
};

const updateAvatarUser = (req, res) => {
  const { avatar } = req.body;
  const owner = req.user._id;
  User.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(validationError).send({ message: 'Переданные данные некорректны' });
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
