//We are taking the existing routes of Task and taking using it
const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/authentication')

const router = new express.Router() //Create a new Router using express!

router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body) //call in a new Task from Task Model we made using Mongoose
    const task = new Task({
        ...req.body, //ES 6 Spread operator copies all data to this task file
        owner: req.user._id //grab the owner's ID (person we just authenticated!)
    }) 

    try {
        await task.save()
        res.status(201).send(task)
    }
    catch(error) {
        res.status(500).send(error)
    }
    // task.save().then(() => {
    //     res.status(201).send(task)
    // }).catch((error) => {
    //     res.status(400).send(error) 
    // })
})

router.get('/tasks', auth, async (req, res) => {
    try{
        // const task = await Task.find({})
        await req.user.populate('tasks')
        res.send(req.user.tasks)
    }
    catch(error){
        res.status(500).send(error)
    }

    // Task.find({}).then((user) => {
    //     res.send(user)
    // }).catch((error) => {
    //     res.status(500).send(error)
    // })
})

router.get('/tasks/:id',auth,  async (req, res) => {
    const _id = req.params.id

    try{
        // const task = await Task.findById(_id)
        const task = await Task.findOne( {_id, owner: req.user._id}) //Id of authenticated user

        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(error){
        res.status(500).send(error)
    }

    // Task.findById(_id).then((task) => {
    //     if(!task){
    //         res.status(404).send('Task Not Found')
    //     }
    //     res.send(task)
    // }).catch((error) => {
    //     res.status(500).send(error)
    // })
})

router.patch('/tasks/:id',auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["description", "completed"]

    const isValid = updates.every((update) => allowedUpdates.includes(update))
    if(!isValid){
        return res.status(400).send({error: 'Invalid Operation'})
    }
    try{
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {runValidators: true, new: true})
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        // const task = await Task.findById(req.params.id)
        if(!task){
            return res.status(404).send('Task not Found. Invalid ID')
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    }catch(error){
        res.status(500).send(error)
    }
})

router.delete('/tasks/:id',auth, async (req, res) => {
    try{
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!task){
            return res.status(404).send('Task Not Found. Invalid ID')
        }
        //Cascade Delete
        res.send(task)
    }catch(error){
        res.status(500).send(error)
    }
})

module.exports = router