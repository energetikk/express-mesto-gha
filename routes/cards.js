const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { linkRegular } = require('../utils/consts');

const {
  getCards,
  createCard,
  deleteCardById,
  setLikeCard,
  setUnLikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', celebrate({ body: Joi.object().keys({ name: Joi.string().min(2).max(30).required(), link: Joi.string().regex(linkRegular).required() }) }), createCard);
router.delete('/:cardId', celebrate({ params: Joi.object().keys({ cardId: Joi.string().length(24).hex().required() }) }), deleteCardById);
router.put('/:cardId/likes', celebrate({ params: Joi.object().keys({ cardId: Joi.string().length(24).hex().required() }) }), setLikeCard);
router.delete('/:cardId/likes', celebrate({ params: Joi.object().keys({ cardId: Joi.string().length(24).hex().required() }) }), setUnLikeCard);

module.exports = router;
