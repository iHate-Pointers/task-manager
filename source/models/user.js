const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('Users', { //First field is string, 2nd is documents we need
    name: {
        type: String,
        default: 'Anonymous',
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate (value) {
            if (!validator.isEmail(value)){ //Custom validation!, Rather then that we can use validator with complex validation combined with validator!
                throw new Error('E-mail is not valid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        validate (value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Your password cannot have password in itself')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate (value) { //This block is mongoose custom validator!
            if(value < 0) { 
                throw new Error('Age must be positive number') //Custom validation!, Rather then that we can use validator with complex validation
            }
        }
    }
})

module.exports = User