const express = require('express')
require('./models/db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000;

app.use(express.json())

/* Go to postman, post request on a new collection with url localhost:3000/users, then go to Body, JSON data not TEXT, then pass a json data when this is running! you will get the response on this console! */ 
// To communincate with postman

//To Create Data
//Send is necessary to not hang postman or send the o/p back to user
app.post('/users', (req, res) => {
    const user = new User(req.body) //call in USERS
    user.save().then(() => { 
        res.status(201).send(user) //Once created 201, status which says it's created!
    }).catch((error) => {
        res.status(400).send(error) //Incase of error we set status 400 which is Bad Input
    })
})

//To Read Data Multiples
app.get('/users', (req, res) => {
    User.find({}).then((user) => { //Finds all elements i.e. find({})
        res.send(user)
    }).catch((error) => {
        res.status(500).send(error)
    })
})

//To Read Single Data
app.get('/users/:id', (req, res) => {
    // console.log(req.params) //This fetches the thing /:id there
    const _id = req.params.id
    //We don't need to convert string _id to object _id, Mongoose is useful!
    User.findById(_id).then((user) => {
        if (!user){
            return res.status(404).send('User Not Found')
        }
        res.send(user) //End points that require fetching a data, response 200 is fine (which is default status)
    }).catch((e) => {
        res.status(500).send(e)
    })
})

app.post('/tasks', (req, res) => {
    const task = new Task(req.body) //call in TASKS
    task.save().then(() => {
        res.status(201).send(task)
    }).catch((error) => {
        res.status(400).send(error) 
    })
})

app.get('/tasks', (req, res) => {
    Task.find({}).then((user) => {
        res.send(user)
    }).catch((error) => {
        res.status(500).send(error)
    })
})

app.get('/tasks/:id', (req, res) => {
    const _id = req.params.id
    Task.findById(_id).then((user) => {
        if(!user){
            res.status(404).send('Task Not Found')
        }
        res.send(user)
    }).catch((error) => {
        res.status(500).send(error)
    })
})

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})