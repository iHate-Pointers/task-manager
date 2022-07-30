//We are taking the existing routes of User and taking using it
const express = require('express')
const User = require('../models/user')
const router = new express.Router() //Create a new Router using express!

// To communincate with postman

//To Create Data
//Send is necessary to not hang postman or send the o/p back to user
/*The highlighted part is just old promise chaining, we got async await, IT IS TO BE NOTED THAT REQ IS TO GET DATA FROM BODY OF CONSOLE AND RES IS TO SEND BACK DATA TO THE CONSOLE*/
router.post('/users', async (req, res) => { //We start returning a promise and fullfill it!
    const user = new User(req.body) //call in USERS

    //Normal Syntax
    // user.save().then(() => { 
    //     res.status(201).send(user) //Once created 201, status which says it's created!
    // }).catch((error) => {
    //     res.status(400).send(error) //Incase of error we set status 400 which is Bad Input
    // })
    
    //async Await Syntax
    try {
        await user.save() //If this promise is fullfilled we run this
        res.status(201).send(user)
    }
    catch(e){
        res.status(400).send(error)
    }
    //Since we are not returning any route, but only req and res
})

//To Read Data Multiples
router.get('/users', async (req, res) => {
    
    try{
        const user = await User.find({}) //If found it's put inside promise user which is back converted to json with await
        res.send(user)
    }
    catch(error){
        res.status(500).send(error)
    }

    // User.find({}).then((user) => { //Finds all elements i.e. find({})
    //     res.send(user)
    // }).catch((error) => {
    //     res.status(500).send(error)
    // })
})

//To Read Single Data
router.get('/users/:id', async (req, res) => {
    // console.log(req.params) //This fetches the thing /:id there
    const _id = req.params.id
    //We don't need to convert string _id to object _id, Mongoose is useful!

    try{
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).send('User Not Found')
        }
        res.send(user)
    }
    catch(error){
        res.status(500).send(e)
    }

    // User.findById(_id).then((user) => {
    //     if (!user){
    //         return res.status(404).send('User Not Found')
    //     }
    //     res.send(user) //End points that require fetching a data, response 200 is fine (which is default status)
    // }).catch((error) => {
    //     res.status(500).send(error)
    // })
})

//Update Operation (U)
//Any property not present that we wanna update in postman body JSON, it is ignored.
router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body) //Array of Strings of req.body (Just getting keys from it)
    //To make sure only the below fields can be updated! if we put some other JSON data besides this, it will show error
    const allowedUpdates = ['name','email','password','age']

    const isValid = updates.every((update) => allowedUpdates.includes(update)) //True if all matches else false
    //Is boolean// Takes a callback function as argument, then takes in every string

    if(!isValid){ 
        return res.status(400).send({error: 'Invalid Operation'})
    }
    try{
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true}) //Grab the id, put new things
        if(!user){
            return res.status(404).send('ID is invalid. User not Found')
        }
        res.send(user)
    }catch(error){
        res.status(500).send(error) 
    }
})
router.delete('/users/:id', async(req, res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(404).send('ID invalid, User not FOUND')
        }
        res.send(user)
    }catch(error){
        res.status(500).send(error)
    }
})

module.exports = router

