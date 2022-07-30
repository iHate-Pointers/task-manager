const express = require('express')
require('./models/db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const app = express()
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

// const router = new express.Router() //No arguments, we use methods on router to customize it
// router.get('/test', (req, res) => {
//     res.send('This is a test!')
// })

/* Go to postman, post request on a new collection with url localhost:3000/users, then go to Body, JSON data not TEXT, then pass a json data when this is running! you will get the response on this console! 
From 400-499, it's USER SIDE ERROR, from 500-599 IT's Client Side ERROR! status codes we can see in catch error is always above 500*/ 

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})