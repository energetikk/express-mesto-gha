const router = require('express').Router();

const {
  // createUser,
  getUserById,
  getUsers,
  updateProfileUser,
  updateAvatarUser,
  // login,
  getUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);
// router.post('/signin', login);
router.get('/me', getUserInfo);
router.get('/:userId', getUserById);
// router.post('/signup', createUser);
router.patch('/me', updateProfileUser);
router.patch('/me/avatar', updateAvatarUser);

module.exports = router;
