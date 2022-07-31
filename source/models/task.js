const mongoose = require('mongoose')

const Task = mongoose.model('Task', { //Basically the 'tasks' inside model is the collection. and inside it we specify documents and their fields
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'     //Reference from this field to another model
    }
})

module.exports = Task