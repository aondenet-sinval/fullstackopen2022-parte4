const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')


loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.password)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }
  const idUser = JSON.stringify(user._id)
  const userForToken = {
    username: user.username,
    id: idUser,
  }
  const token = jwt.sign( userForToken , process.env.SECRET )
  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
