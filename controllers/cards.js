const Card = require('../models/card');

const { notFoundError, validationError, defaultError } = require('../errors/errors');
const ConflictError = require('../errors/conflictError');

const statusOK = 201;

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      res.status(defaultError).send({ message: 'Произошла неизвестная ошибка сервера', err: err.message });
    });
};

const deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => new Error('Not found'))
    // .then((card) => res.status(200).send(card))
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Card.deleteOne(card)
          .then(() => res.send({ data: card }))
          .catch(next);
      } else {
        throw new ConflictError('Недостаточно прав для удаления');
      }
    })
    .catch(next);
  // .catch((err) => {
  //   if (err.name === 'CastError') {
  //     return res.status(validationError).send({ message: 'Передан невалидный ID' });
  //   }
  //   if (err.message === 'Not found') {
  //     return res.status(notFoundError).send({ message: 'Объект не найден' });
  //   }
  //   return res.status(defaultError).send({ message: 'Произошла неизвестная ошибка сервера' });
  // });
};

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ owner, name, link })
    .then((card) => res.status(statusOK).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(validationError).send({ message: 'Переданные данные некорректны' });
      }
      return res.status(defaultError).send({ message: 'Произошла неизвестная ошибка сервера' });
    });
};

const setLikeCard = (req, res) => {
  const owner = req.user._id;
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: owner } }, { new: true })
    .orFail(() => new Error('Not Found'))
    .then((card) => res.status(statusOK).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(validationError).send({ message: 'Передан невалидный ID' });
      }
      if (err.message === 'Not Found') {
        return res.status(notFoundError).send({ message: 'Объект не найден' });
      }
      return res.status(defaultError).send({ message: 'Произошла неизвестная ошибка сервера' });
    });
};

const setUnLikeCard = (req, res) => {
  const owner = req.user._id;
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: owner } }, { new: true })
    .orFail(() => new Error('Not Found'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(validationError).send({ message: 'Передан невалидный ID' });
      }
      if (err.message === 'Not Found') {
        return res.status(notFoundError).send({ message: 'Объект не найден' });
      }
      return res.status(defaultError).send({ message: 'Произошла неизвестная ошибка сервера' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  setLikeCard,
  setUnLikeCard,
};
