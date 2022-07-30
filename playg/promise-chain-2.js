require('../source/models/db/mongoose') //.. means 2 folders back
const Task = require('../source/models/task')

// Task.findByIdAndDelete('62e2cccb0f6239fe5cd7cfa0').then((task) => {
//     console.log(task)
//     return Task.countDocuments( {completed: false} )
// }).then((res) => {
//     console.log(res)
// }).catch((error) => {
//     console.log(error)
// })

//Converting to async await pair
const deleteTaskCount = async (id, completed) => {
    const del = await  Task.findByIdAndDelete(id) //use of storing it is we can use it later since we storing it!
    const count = await Task.countDocuments({completed})
    // console.log(del)
    return count
}

deleteTaskCount('62e2ab010203a3e19686318f', false).then((count) => {
    console.log(count)
}).catch((error) => {
    console.log(error)
})