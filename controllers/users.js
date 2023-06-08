/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
/* eslint-disable no-multiple-empty-lines */
const User = require('../models/user');
// const users = [];
// let id = 0;
const getUsers = (req, res) => {
  // console.log('это GET запрос на /юзерс');
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(500).send({ "message": 'Internal Server Error', err: err.message, stack: err.stack }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => new Error('not found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => res.status(500).send({ "message": 'Internal Server Error', err: err.message, stack: err.stack }));
  // const user = users.find((item) => item.id === Number(userId));

  // if (user) {
  //   return res.status(200).send(user);
  // }
  // return res.status(404).send({ 'message': 'User not found' });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => res.status(500).send('Internal error'));
};

module.exports = {
  createUser,
  getUserById,
  getUsers,
};
