//We are taking the existing routes of Task and taking using it
const express = require('express')
const Task = require('../models/task')
const router = new express.Router() //Create a new Router using express!

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body) //call in a new Task from Task Model we made using Mongoose

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

router.get('/tasks', async (req, res) => {

    try{
        const user = await Task.find({})
        res.send(user)
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

router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    try{
        const task = await Task.findById(_id)
        if(!task){
            return res.status(404).send('Not Found')
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

router.patch('/tasks/:id', async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["description", "completed"]

    const isValid = updates.every((update) => allowedUpdates.includes(update))
    if(!isValid){
        return res.status(400).send({error: 'Invalid Operation'})
    }
    try{
        const user = await Task.findByIdAndUpdate(req.params.id, req.body, {runValidators: true, new: true})
        if(!user){
            return res.status(404).send('Task not Found. Invalid ID')
        }
        res.send(user)
    }catch(error){
        res.status(500).send(error)
    }
})

router.delete('/tasks/:id', async (req, res) => {
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!task){
            return res.status(404).send('Task Not Found. Invalid ID')
        }
        res.send(task)
    }catch(error){
        res.status(500).send(error)
    }
})

module.exports = router