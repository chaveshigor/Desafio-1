const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

// Midllewares
function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers
  const userAlreadyExists = users.find((user) => user.username === username)

  if(!userAlreadyExists) {
    return response.status(400).json({error: "user not exists"})
  }

  request.user = userAlreadyExists
  return next()
}

function checkIfTodoExist(request, response, next) {
  const { id } = request.params
  const { user } = request

  const currentTodo = user.todos.find((todo) => todo.id === id)
  if(!currentTodo) {
    return response.status(404).json({error: "todo not found"})
  }

  request.currentTodo = currentTodo

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
  const { user } = request
  const todos = user.todos

  return response.status(200).json(todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request
  const { title, deadline } = request.body

  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(newTodo)

  return response.status(201).json(newTodo)
});

app.put('/todos/:id', checksExistsUserAccount, checkIfTodoExist, (request, response) => {
  const { currentTodo } = request
  console.log(currentTodo)
  const { title, deadline } = request.body

  currentTodo.title = title
  currentTodo.deadline = new Date(deadline)

  return response.status(200).json(currentTodo)
});

app.patch('/todos/:id/done', checksExistsUserAccount, checkIfTodoExist, (request, response) => {
  const { currentTodo } = request

  currentTodo.done = true

  return response.status(200).json(currentTodo)
});

app.delete('/todos/:id', checksExistsUserAccount, checkIfTodoExist, (request, response) => {
  const { user } = request
  const { currentTodo } = request

  user.todos.splice(currentTodo, 1)

  return response.status(204).json()
});

module.exports = app;