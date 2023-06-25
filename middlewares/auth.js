// const jwt = require('jsonwebtoken');

// const auth = (req, res, next) => {
//   const token = req.cookies.jwt;
//   let payload;

//   try {
//     payload = jwt.verify(token, 'secret_phrase');
//     console.log(payload);
//   } catch (err) {
//     next(err);
//   }
//   req.user = payload;
//   next();
// };

// module.exports = auth;

const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorizedError');

const auth = (req, res, next) => {
  let token;
  try {
    token = req.cookies.jwt;
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  let payload;

  try {
    payload = jwt.verify(token, 'secret_phrase');
    console.log(payload);
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  req.user = payload;
  next();
};

module.exports = auth;
