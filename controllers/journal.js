const journalRouter = require('express').Router()
const Journal = require('../models/journal')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

require('express-async-errors')

//retrieve the journal posts of a user
journalRouter.get('/', async (request, response) => {
    const journal = await Journal.find({}).populate('user', {username:1})
    if (journal){
      response.json(journal.map(journal=> journal.toJSON()))
    }
    else {
      response.status(404).end()
    }
  })

//creating journal entry, making sure there is a user logged in. 
journalRouter.post('/', async (request,response)=> {
    console.log("Got here");
    const body = request.body

    if (!request.token || !request.decodedToken) {
        return response.status(401).json({ error: 'token missing or invalid' })
      }
      

    const user = request.user
    console.log(user.journals)
   

    const journal = new Journal({
        title: body.title,
        date: body.date, 
        data: body.data,
        user: user._id
    })

    if (!date) { 
        var today = new Date();
        var date = today.toUTCString()
        journal.date = date
    }

    if (!journal.title || !journal.data || !journal.user){
        response.status(400).json("400 Bad Request, missing title, body or user.").end()
    }


    const journalSave = await journal.save() //save journal 
    if (journalSave){ //update user with new journal entry as well 
        user.journals = user.journals.concat(journalSave._id)
        await user.save()
        response.status(201).json(journalSave)
    }

    else {
        response.status(404).end()
    }
})


module.exports = journalRouter 