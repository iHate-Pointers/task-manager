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
    }
})

module.exports = Task