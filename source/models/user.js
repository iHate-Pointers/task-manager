const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const sharp = require('sharp')
const jwt = require('jsonwebtoken')
const Task = require('./task')
 
const userSchema = new mongoose.Schema({
    name: {
    type: String,
    default: 'Anonymous',
    required: true,
    trim: true
},
    email: {
    type: String, 
    unique: true, //Create an index in MongoDB, saying it's unique!
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
    },
    tokens: [{ //Object of arrays
        token: { //
            type: String,
            required: true //No need Trim as it's computer designed
        }
    }],
    avatar: {
        type: Buffer //This type helps us store buffer in binary Data!
    }
}, { //To get timestamps
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id', // is a string local to this
    foreignField: 'owner' //is a string the name of the other field or rather owner for this
})
//To set the middleware up (Schema->)
//Hide public data
// userSchema.methods.getPublicProfile = function () {

//With this option data will be hidden from every place, including reading and all
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar //Remove it from profile response only(hide it) since it takes lotta space

    return userObject //send the above two as response
}

//To generate token for a user with specific email address
/*Methods are accesible in instances, static methods are accesible in models (like has email and password  etc.)*/
userSchema.methods.generateAuthToken = async function () { //Since it contains this keyword
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET) //Since it's an object we need to stringy it up, 2nd arg is secret key
    user.tokens = user.tokens.concat ({ token }) //Adding the above generated string to token
    await user.save()

    return token
 
}

//To get cred by username alone
userSchema.statics.findByCredentials = async (email, password) => {
    //Finding by email, as we got plain text pass, hashed password
    const user = await User.findOne( {email} )
    if(!user){
        throw new Error('Unable to Login') 
    }

    const isMatch = await bcrypt.compare(password, user.password) //If password is match 
    if(!isMatch){
        throw new Error('Unable to Login') //single error only
    }
    return user
}

// userSchema.pre --> Before the event
// userSchema.post --> After the event
//Schema incase of authentication, Hash the password we recieve
//Hashes password before it's saved, Middleware
userSchema.pre('save', async function (next) { //Has to be standared function as arrow function don't bind this keyword. This is crucial here
    const user = this //Grab a user that's about to be saved. 

    // console.log('Just before saving')

    if(user.isModified('password')) { //If password is modified
        user.password = await bcrypt.hash(user.password, 8) //Taking the pass and Hashing it!
    }
    next()
})

//Delete user task when it is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id})
    next()
})

const User = mongoose.model('User', userSchema) //First field is string, 2nd is documents we need
    //Mongoose creates the object inside this to something called Schema, Schema is necessary to grab data in correct form
   

module.exports = User