//We are taking the existing routes of User and taking using it
const express = require('express')
const User = require('../models/user')
const router = new express.Router() //Create a new Router using express!
const auth = require('../middleware/authentication')

// To communincate with postman

//To Create User Data
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
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    }
    catch(error){
        res.status(500).send(error)
    }
    //Since we are not returning any route, but only req and res
})

router.post('/users/login', async (req, res) => { //To login with existing account
    /*Two ways to get this done, one is by normally done by finding a user by credential and check hash to compare the pass*/
    /*Other way is by using reuseable function, this approach we doo*/
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password) //This is only possible cause of schema. Else It ain't possible
        const token = await user.generateAuthToken() //specific token of user, generateAuthToken() and findByCredentials are function in user models using Schema
        // res.send({user: user.getPublicProfile(), token}) 
        res.send({user, token}) //User data and token () using toJSON
    }catch(e){
        res.status(400).send()
    }
})
//To logout
router.post('/users/logout', auth, async (req, res) => {
    //When we logged in on multiple device we only want to logout from one alone
    try{    
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token //token.token is going to each token and grabbing the token file
        }) 
        await req.user.save()

        res.send()
    }catch(error){
         res.status(500).send()
    }
})

//Remove all tokens of user (From all tokens(phone,pc,lappy etc. ))
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})
//To Read Data of user or get the profile only
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
    // try{
    //     const user = await User.find({}) //If found it's put inside promise user which is back converted to json with await
    //     res.send(user)
    // }
    // catch(error){
    //     res.status(500).send(error)
    // }

    // User.find({}).then((user) => { //Finds all elements i.e. find({})
    //     res.send(user)
    // }).catch((error) => {
    //     res.status(500).send(error)
    // })
})

//To Read Single Data (Thiis ain't required as we need to fetch user data only not other ppl's data )
// router.get('/users/:id', async (req, res) => {
    // console.log(req.params) //This fetches the thing /:id there
//     const _id = req.params.id
//     //We don't need to convert string _id to object _id, Mongoose is useful!

//     try{
//         const user = await User.findById(_id)
//         if(!user){
//             return res.status(404).send('User Not Found')
//         }
//         res.send(user)
//     }
//     catch(error){
//         res.status(500).send()
//     }

//     // User.findById(_id).then((user) => {
//     //     if (!user){
//     //         return res.status(404).send('User Not Found')
//     //     }
//     //     res.send(user) //End points that require fetching a data, response 200 is fine (which is default status)
//     // }).catch((error) => {
//     //     res.status(500).send(error)
//     // })
// })

//Update Operation (U)
//Any property not present that we wanna update in postman body JSON, it is ignored.
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body) //Array of Strings of req.body (Just getting keys from it)
    //To make sure only the below fields can be updated! if we put some other JSON data besides this, it will show error
    const allowedUpdates = ['name','email','password','age']

    const isValid = updates.every((update) => allowedUpdates.includes(update)) //True if all matches else false
    //Is boolean// Takes a callback function as argument, then takes in every string

    if(!isValid){ 
        return res.status(400).send({error: 'Invalid Operation'})
    }
    try{
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true}) //Middle ware with this keyword cannot execute this hence we go with new layout
        //Replace all user by req.user as we gather user from console itself
        // const user = await User.findById(req.user)
        //iterate over list of updates and go for allupdates if many
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save() //pass out the middleware to console!

        // Grab the id, put new things
        // if(!user){
        //     return res.status(404).send('ID is invalid. User not Found')
        // }
        res.send(req.user) //Print to postman terminal
    }catch(error){
        res.status(500).send(error) 
    }
})
router.delete('/users/me', auth, async (req, res) => {
    try{
        //Since we are fetching it from DB, not having user is not a question!
        // const user = await User.findByIdAndDelete(req.user._id) //Instead of req.params.id(as we no longer giving user id manually)
        // if(!user){
        //     return res.status(404).send('ID invalid, User not FOUND')
        // }
        await req.user.remove() //This will remove the account
        res.send(req.user)
    }catch(error){
        res.status(500).send()
    }
})

module.exports = router

