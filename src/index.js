const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  
  const userAlreadyExists = users.find((user) => user.username === username)

  if(userAlreadyExists) {
    return response.status(400).json({error: "user already exists"})
  }

  request.user = userAlreadyExists

  return next()
}

app.post('/users', (request, response) => {
  const { name, username } = request.body

  const userAlreadyExists = users.find((user) => user.username === username)

  if(userAlreadyExists) {
    return response.status(400).json({error: "user already exists"})
  }

  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: [],
    created_at: new Date()
  }

  users.push(newUser)

  return response.status(201).json(newUser)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;