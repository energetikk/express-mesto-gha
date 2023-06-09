/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable no-multiple-empty-lines */
const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

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
app.use(router);

app.listen(PORT, () => {
  console.log(`Слушаю порт ${PORT}`);
});
