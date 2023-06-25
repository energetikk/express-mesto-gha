const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { createUser, login } = require('../controllers/users');
const NotFoundError = require('../errors/notFoundError');

const { linkRegular } = require('../utils/consts');
const auth = require('../middlewares/auth');

router.post('/signin', celebrate(
  {
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  },
), login);

router.post('/signup', celebrate(
  {
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).optional(),
      avatar: Joi.string().regex(linkRegular).optional(),
      about: Joi.string().min(2).max(30).optional(),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  },
), createUser);

router.use(auth);

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.get('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
});

router.use('*', (req, res, next) => {
  next(new NotFoundError('Указанный путь не существует'));
});

module.exports = router;
