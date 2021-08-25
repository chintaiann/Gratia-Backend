const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
require('express-async-errors')


usersRouter.get('/',async (request,response) => {
  const user = await User.find({}).populate('journals')
  if (user){
    response.json(user)
  }
  else {
    response.status(404).end()
  }
})

usersRouter.post('/', async(request,response) => {
    const body = request.body
    if (!body.password || body.password.length < 3) {
        return response.status(400).json({ error: 'password length must be above 3.' })
    }
  
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
  
    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })
  
    const savedUser = await user.save()
  
    response.json(savedUser)
  })


  module.exports = usersRouter
