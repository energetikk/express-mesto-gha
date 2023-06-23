const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const router = require('./routes');
const { notFoundError } = require('./errors/errors');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1/mestodb');
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use(cookieParser());
app.use(router);
app.use('/*', (req, res) => {
  res.status(notFoundError).send({ message: 'Что-то пошло не так...' });
});

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Слушаю порт ${PORT}`);
});
