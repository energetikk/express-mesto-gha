/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
/* eslint-disable no-multiple-empty-lines */
const Card = require('../models/card');

const { notFoundError, validationError, defaultError } = require('../errors/errors');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => res.status(500).send({ "message": 'Internal Server Error', err: err.message, stack: err.stack }));
};

const getUserById = (req, res) => {
  Card.findById(req.params.userId)
    .orFail(() => new Error('Not found'))
    .then((card) => res.status(200).send(card))
    .catch((err) => res.status(500).send({ "message": "Internal Server Error", err: err.message, stack: err.stack }));
};

const createCard = (req, res) => {
  const { name, about, avatar } = req.body;
  Card.create({ name, about, avatar })
    .then((card) => res.status(201).send(card))
    .catch((err) => res.status(500).send('Internal error'));
};

module.exports = {
  createCard,
  getUserById,
  getCards,
};
