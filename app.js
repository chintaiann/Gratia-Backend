const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const userRouter = require('./controllers/user')
const journalRouter = require('./controllers/journal')
const loginRouter = require('./controllers/login')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })


  app.use(cors())
  app.use(express.json())

  
  app.use(middleware.requestLogger)
  app.use(middleware.tokenExtractor)
  app.use(middleware.userExtractor)


  app.use('/api/users',userRouter)
  app.use('/api/login',loginRouter)
  app.use('/api/journals', journalRouter)

  app.use(middleware.unknownEndpoint)
  app.use(middleware.errorHandler)
  
  module.exports = app