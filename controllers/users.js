/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
/* eslint-disable no-multiple-empty-lines */
const express = require('express');

const users = [];
let id = 0;

const getUsers = (req, res) => {
  console.log('это GET запрос на /юзерс');
  res.status(200).send(users);
};


const getUserById = (req, res) => {
  console.log('это GET запрос на /юзерс');
  console.log(req.params.userId);
  const { userId } = req.params;
  const user = users.find((item) => item.id === Number(userId));

  if (user) {
    return res.status(200).send(user);
  }
  return res.status(404).send({"message": "User not found"});
};



const createUser = (req, res) => {
  console.log('это POST запрос на /юзерс');
  console.log("req.body", req.body);
  id+=1;
  const newUser = {
    id,
    ...req.body,
  }
  users.push(newUser);
  res.status(201).send(newUser);
};

module.exports = {
  createUser,
  getUserById,
  getUsers
};