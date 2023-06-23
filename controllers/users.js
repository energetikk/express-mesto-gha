const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user');

const { notFoundError, validationError, defaultError } = require('../errors/errors');
const { NotFoundError } = require('../errors/notFoundError');
// const { NotFoundError } = require('../errors/notFoundError');
// const { NotFoundError } = require('../errors/notFoundError');

const statusOK = 201;

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .orFail(() => new Error('Неправильный логин или пароль'))
    .then((user) => {
      bcrypt.compare(String(password), user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            const jwt = jsonWebToken.sign({ _id: user._id }, 'secret_phrase');
            res.cookie('jwt', jwt, {
              maxAge: 360000,
              httpOnly: true,
              sameSite: true,
            });
            res.status(200).send({ data: user.toJSON() });
          } else {
            res.status(401).send({ message: 'Неправильный логин или пароль' });
          }
        });
    })
    .catch(next);
};

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

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Ползователь с указанным id не найден');
      } else {
        next(res.send(user));
      }
    })
    .catch(next);
};

const createUser = (req, res) => {
  // console.log('kkykykykykkykyky');
  console.log(req.body);
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
  login,
  createUser,
  getUserById,
  getUserInfo,
  getUsers,
  updateProfileUser,
  updateAvatarUser,
};
