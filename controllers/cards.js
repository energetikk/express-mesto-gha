const Card = require('../models/card');

const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');
// const DefaultError = require('../errors/defaultError');
const ValidationError = require('../errors/validationError');

const statusOK = 201;

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => new NotFoundError('Карточка с указанным id не найдена'))
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Card.deleteOne(card)
          .then(() => res.send({ data: card }))
          .catch(next);
      } else {
        throw new ForbiddenError('Недостаточно прав для удаления');
      }
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ owner, name, link })
    .then((card) => res.status(statusOK).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданные данные некорректны'));
      } else {
        next(err);
      }
    });
};

const setLikeCard = (req, res, next) => {
  const owner = req.user._id;
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: owner } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Объект не найден');
      } else {
        next(res.send({ data: card }));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Передан невалидный запрос id карточки'));
      } else {
        next(err);
      }
    });
};

const setUnLikeCard = (req, res, next) => {
  const owner = req.user._id;
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: owner } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Объект не найден');
      } else {
        next(res.send({ data: card }));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Передан невалидный запрос id карточки'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  setLikeCard,
  setUnLikeCard,
};
