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

// /tasks alone will give us all tasks, which is not that great. Hence we can do better by ->
// First adding filtering, true or false
// To add support for pagination we add limit and skip equal to numbers
// Limit is basically number of data on a page, skip = number of data we skip
// generally sorting is by 1 = ascending, -1 = descending

// URL layout of the filter, pagination, sorting
// GET /tasks?completed=true or completed=false
// GET /tasks?limit=10&skip=0,10 etc...
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort  = {}
     
    if(req.query.completed){
        match.completed = (req.query.completed === 'true')? true: false 
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = (parts[1] === 'desc')? -1 : 1
    }

    try{
        // const task = await Task.find({})
        // await req.user.populate('tasks')
        await req.user.populate({ //This to exclude tasks with the specific completedvalue
            path: 'tasks',
            match,
            options: { //For sorting and pagination
                // limit: 2 //IF we set this to 2, we only see 2 data,
                limit: parseInt(req.query.limit), //It will convert to integer since query is string
                skip: parseInt(req.query.skip),
                sort //1 for ascending, -1 descending
            }
        })
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