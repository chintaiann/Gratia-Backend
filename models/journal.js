const mongoose = require('mongoose')



const journalSchema = new mongoose.Schema({
    title: {type: String,
    required: true,
    maxlength: 30,
    unique:true},
    date: String, 
    data: {type:String,
    required:true, 
    maxlength:140,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
})

journalSchema.set('toJSON',{
    transform:(document,returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Journal',journalSchema)