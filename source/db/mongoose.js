const mongoose = require('mongoose')
// require('dotenv').config('./config/dev');
// const validator = require('validator')

//IT uses previously mongoDB client thingy
mongoose.connect(process.env.MONGODB_URI,{ /** */
    useNewUrlParser: true, //MongoDB new version will always make this seem tre
    // useCreateIndex: true, //This will make sure indexs are made to quickly access the data we need
    // useFindAndModify: true
})
/* Data Sanitization helps us alter data before saving, removing empty space before sending it back to our DB
Data Validation we can enfore to some rules, user age should be greater than 18 etc...*/
//
// const User = mongoose.model('Users', { //First field is string, 2nd is documents we need
//     name: {
//         type: String,
//         default: 'Anonymous',
//         trim: true
//     },
//     email: {
//         type: String,
//         required: true,
//         trim: true,
//         validate (value) {
//             if (!validator.isEmail(value)){ //Custom validation!, Rather then that we can use validator with complex validation combined with validator!
//                 throw new Error('E-mail is not valid')
//             }
//         }
//     },
//     password: {
//         type: String,
//         required: true,
//         minLength: 6,
//         validate (value){
//             if(value.toLowerCase().includes('password')){
//                 throw new Error('Your password cannot have password in itself')
//             }
//         }
//     },
//     age: {
//         type: Number,
//         default: 0,
//         validate (value) { //This block is mongoose custom validator!
//             if(value < 0) { 
//                 throw new Error('Age must be positive number') //Custom validation!, Rather then that we can use validator with complex validation
//             }
//         }
//     }
// })

// const me = new User({ 
//     name: 'Shoaib',
//     email: 'sasonian233@gmail.com',
//     password: 'Pass123!',
//     age: 10 //Validation here using Mongoose! 
    
// })

// me.save().then((data) => { //Saving data in db, returns a promise
//     console.log(data)
// }).catch((error) => {
//     console.log(error)
// })

// const tasks = mongoose.model('Task', { //Basically the 'tasks' inside model is the collection. and inside it we specify documents and their fields
//     description: {
//         type: String,
//         trim: true,
//         required: true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     }
// })

//Examples ---

// const task = new tasks({
//     description: "To Sleep",
//     // completed: false
// })

// task.save().then((data) => {
//     console.log(data)
// }).catch((error) => {
//     console.log(error)
// })
