const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const { notFoundError } = require('./errors/errors');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '6481f7a8f5ca6c3683b7e6a3',
  };
  next();
});

mongoose.connect('mongodb://127.0.0.1/mestodb');
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);

app.use(router);
app.use('/*', (req, res) => {
  res.status(notFoundError).send({ message: 'Что-то пошло не так...' });
});

app.listen(PORT, () => {
  console.log(`Слушаю порт ${PORT}`);
});
