const express = require('express')
require('./db/mongoose') //We only need to connect to DB with this
const User = require('./models/user')
const Task = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const multer = require('multer')

const app = express()
const port = process.env.PORT /** */

//This is Middleware, all request to get is disabled here!
// app.use((req, res, next) => {
//     console.log(req.method, req.path) 
//     next() //helps reach the route handler else will be stuck on the above command
//      Somtimes your middleware needs to stop the route handler!
//      if(req.method === 'GET'){
//         res.send('GET requests are disabled')
//      } else{
//         next()
//      }
// })

//Maintainance Mode
// app.use((req, res, next) => {
//     res.status(503).send('Server is in maintainance Mode')
// })



app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


// Multer Demonstration (File Uploads)
// const upload = multer({
//     dest: 'images', //This automatically creates a folder named like the value of dest
//     limits: {
//         fileSize: 1000000 //Max size set to 1000000Bytes
//     },
//     fileFilter(req, file, cb){ //[req - has request], [file - type of file] [cb - callback]
//         // In multer file information, we want to use OriginalName, which gets orginal file's name
//         // if (!file.originalname.endsWith('.pdf')){ //File's name is not pdf
//         if (!file.originalname.match(/\.(doc|docx)$/)){
//             return cb(new Error('Please upload a word document!'))
//         }
//         cb(undefined, true)
//         // cb(new Error('File must be a PDF'))
//         // cb(undefined, true)
//         // cb(undefined, false)
//     }
// })

// const errorMiddleware = (req, res, next) => {
//     throw new Error('From my Middleware')
// }

//Endpoint where client will be able to upload these files
//Alawys add auth middle ware inbetween upload, cause without authentication we canoot upload a pic
// app.post('/test', auth, upload.single('upload'), (req, res) => { //midware test.single('upload'), helps us upload a single file in this route

//     res.send()
// }, (error, req, res, next) => { /*all 4 must be provided so express knows it's to handle errors */
//     // res.status(400).send( { error: error.message}) //This will send the user a useful error message (error we said above)
//     res.status(400).send( { error: error.message})
// })

// const router = new express.Router() //No arguments, we use methods on router to customize it
// router.get('/test', (req, res) => {
//     res.send('This is a test!')
// }) 

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})

/* Go to postman, post request on a new collection with url localhost:3000/users, then go to Body, JSON data not TEXT, then pass a json data when this is running! you will get the response on this console! 
From 400-499, it's USER SIDE ERROR, from 500-599 IT's Client Side ERROR! status codes we can see in catch error is always above 500*/

//Authentication part!!
//We need to hide the data from users else there is a risk of it getting stolen and stuffs!
//Solution is to store not a plain text pass but a hashed password!
//Algorithm we are using is called B-Crypt


// const bcryptTest = async () => {
//     const password = '123456789'
//     const hashPass = await bcrypt.hash(password, 8) //Arg1: The password, ARg2: The number of hashes
//     //too less hashes easy to crack, too many hashes hard to run!
//     console.log(password)
//     console.log(hashPass) //With Hashing, we cannot get the value back!! Different from Encryption where we can get the value back   
    
//     const isMatch = await bcrypt.compare('123456789',hashPass)
//     console.log(isMatch)
// }
// bcryptTest()


//Json Web Token
// const myFunction = async () =>{
//     const token = jwt.sign({_id: '2134ab'}, 'thisisoppai', { expiresIn: '5 seconds'}) //The signature of 2nd arg is kinda secret! 1st arg is our data, 3rd arg is to expire
//     console.log(token)

//     const data = jwt.verify(token, 'thisisoppai')
//     console.log(data)
// }
// myFunction()

//Express MiddleWare
//do something, is like checking for valid authentication, see how many emails are there, etc.

//Hiding Private Data
// const pet = {
//     name: 'doggo'
// }

// //Since JSON is kinda linked if we return empty JSON by using toJSON then it will be reflected on every function 
// //Same concept we used in schema.toJSON
// pet.toJSON = function(){
//     // console.log(this)
//     // return this
//     return {}
// }

// console.log(JSON.stringify(pet))

//Little Task (Schema) to dispaly all tasks of user
// const main = async () => {
//     // const task = await Task.findById('62e63061cccb526d045dca5c')
//     // await task.populate('owner') //Populate data from owner, all data of the owner from USers too (We linked in owner field in task)
//     // console.log(task.owner) 

//     const user = await User.findById('62e63045cccb526d045dca54') //Grabbing the owner and all their tasks
//     await user.populate('tasks') //tasks is setup in userSchema.virtual('tasks')
//     console.log(user.tasks) //Hence with this we can get the task we wanted without including the whole Task module itself
//     //Consvering the reuseability option!
// }   
 
// main()

