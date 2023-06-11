const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCardById,
  setLikeCard,
  setUnLikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCardById);
router.put('/:cardId/likes', setLikeCard);
router.delete('/:cardId/likes', setUnLikeCard);

module.exports = router;
