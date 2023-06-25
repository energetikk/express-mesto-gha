const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user');

// const { notFoundError, validationError, defaultError } = require('../errors/errors');
const NotFoundError = require('../errors/notFoundError');
const ConflictError = require('../errors/conflictError');
const UnauthorizedError = require('../errors/unauthorizedError');
const ValidationError = require('../errors/validationError');
const DefaultError = require('../errors/defaultError');

const statusOK = 201;

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .orFail(() => new UnauthorizedError('Неправильный логин или пароль'))
    .then((user) => {
      bcrypt.compare(String(password), user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            const jwt = jsonWebToken.sign({ _id: user._id }, 'secret_phrase');
            res.cookie('jwt', jwt, {
              maxAge: 604800000,
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

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    // .orFail(() => new NotFoundError('Объект не найден'))
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с таким id не найден');
      } else {
        next(res.send(user));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Передан невалидный ID'));
      } else {
        next(err);
      }
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

const createUser = (req, res, next) => {
  console.log(req.body);
  bcrypt.hash(String(req.body.password), 10)
    .then((hashedpassword) => User.create({ ...req.body, password: hashedpassword })
      .then((user) => res.status(statusOK).send({ data: user.toJSON() })
        .catch(next)))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким E-mail уже существует'));
      }
      next(err);
    });
};

const updateProfileUser = (req, res) => {
  const { name, about } = req.body;
  const owner = req.user._id;
  User.findByIdAndUpdate(owner, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданные данные некорректны');
      } else throw new DefaultError('Произошла неизвестная ошибка сервера');
    });
};

const updateAvatarUser = (req, res) => {
  const { avatar } = req.body;
  const owner = req.user._id;
  User.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданные данные некорректны');
      } else throw new DefaultError('Произошла неизвестная ошибка сервера');
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
