const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const cookieParser = require('cookie-parser');
const { linkRegular } = require('../utils/consts');

const {
  getUserById,
  getUsers,
  updateProfileUser,
  updateAvatarUser,
  getUserInfo,
} = require('../controllers/users');

router.use(cookieParser());

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:userId', celebrate({ params: Joi.object().keys({ userId: Joi.string().length(24).hex().required() }) }), getUserById);
router.patch('/me', celebrate({ body: Joi.object().keys({ name: Joi.string().min(2).max(30).required(), about: Joi.string().min(2).max(30).required() }) }), updateProfileUser);
router.patch('/me/avatar', celebrate({ body: Joi.object().keys({ avatar: Joi.string().regex(linkRegular).required() }) }), updateAvatarUser);

module.exports = router;
