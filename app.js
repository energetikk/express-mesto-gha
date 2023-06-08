/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable no-multiple-empty-lines */
const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const { PORT = 3000 } = process.env;
const app = express();
app.use(express.json());
app.use(router);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.listen(PORT, () => {
  console.log(`Слушаю порт ${PORT}`);
}
)