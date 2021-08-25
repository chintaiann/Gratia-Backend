
const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
  }

  const tokenExtractor = async (request, response, next) => {
      const authorization = request.get('authorization')
      if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
          request.token = authorization.substring(7)
      } else {
          request.token = null
      }
      try {
          const decodedToken = await jwt.verify(request.token, process.env.SECRET)
          request.decodedToken = decodedToken
      } catch (error) {
          request.decodedToken = null
      }
      next()
  }
  
  const userExtractor = async (request,response,next)=> {
    if (request.decodedToken !== null){
    const user = await User.findById(request.decodedToken.id)
    request.user = user
   }
    next()
  }
  
  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  const errorHandler = (error, request, response, next) => {
    logger.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
      return response.status(401).json({
        error: 'invalid token'
      })
    }
  
  
    next(error)
  }



module.exports = tokenExtractor
  
  module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor,
    getTokenFrom
  }