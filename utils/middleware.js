const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const requestLogger = (request, response, next) => {
  logger.info('Method: ', request.method)
  logger.info('Path: ', request.path)
  logger.info('Body: ', request.body)
  logger.info('---')
  next()
}
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
const errorHandler = (error, request, response, next) => {
  logger.error(error.message)
  if(error.name === 'CastError') {
    return response.status(400).send( { error: 'id mal formatted' } )
  } else if (error.name === 'ValidationError') {
    return response.status(400).json( { error: error.message } )
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }
  next(error)
}
const getTokenFrom = async request => {
  const authorization = await request.get('authorization')
  if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}
const tokenExtractor = async (request, response, next) => {
  try {
    const token = await getTokenFrom(request)
    // console.log('tokenExtractor ', token);
    const decodedToken = await jwt.verify(token, process.env.SECRET)
    // console.log('decodedToken', decodedToken);
    if (!decodedToken.id) {
      return response.status(401).json( { error: 'token missing or invalid' } )
    }
  } catch (error) {
    next(error)
  }

  next()
}

const userExtractor = async (request, response, next) => {
  //
  const body = await request.body
  let user = await User.findById(body.userId)
  // console.log('userExtractor ', user);
  //adicionando usuário na solicitação request
  request.user = await user
  next()
}
module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}
