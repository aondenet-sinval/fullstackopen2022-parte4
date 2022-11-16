const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs', { title: 1, author: 1, url: 1, id: 1 })
  response.status(200).json(users)
})
usersRouter.get('/:id', async (request, response, next) => {
  const user = await User.findById(request.params.id)
  try {
    response.status(200).json(user)
  } catch (error) {
    response.status(404).end()
    next(error)
  }
} )
usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body

  const existingUser = await User.findOne({ username })
  //validar usuário exclusivo
  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique'
    })
  }
  //validar senha
  if (password) {
    if (password.length < 3) {
      return response.status(400).json({
        error: 'senha não atende ao critério tamanho'
      })
    }
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User( {
    name: name,
    username: username,
    password: passwordHash,
  } )
  try {
    const result = await user.save()
    response.status(201).json(result)
  } catch(error) {
    next(error)
  }
} )
usersRouter.delete('/:id', (request, response, next) => {
  User.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    } )
    .catch(error => next(error))
} )
usersRouter.put('/:id', async (request, response, next) => {
  const { name, username, password } = request.body
  //validar senha
  if (password) {
    if (password.length < 3) {
      return response.status(400).json({
        error: 'senha não atende ao critério tamanho'
      })
    }
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const user = {
    name: name,
    username: username,
    password: passwordHash,
  }
  const updatedUser = await User.findByIdAndUpdate(request.params.id, user, { new: true } )
  try {
    response.status(201).json(updatedUser)
  } catch (error) {
    next(error)
  }
} )

module.exports = usersRouter
