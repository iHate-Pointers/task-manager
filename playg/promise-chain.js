require('../source/models/db/mongoose') //.. means 2 folders back
const User = require('../source/models/user')

//Basically updating age to 1
// User.findByIdAndUpdate('62e2b9c7eafbb1f74ab74d6b', { age: 1 }).then((user) =>{ //Arg1, is id, arg2 is object we want to update
    // console.log(user)
//     return User.countDocuments({age : 1})
// }).then((res) => {
//     console.log(res)
// }).catch((e) => {
//     console.log(e)
// })

const updateAgeCount = async (id, age) => { //Reuseability, using Async Await
    const user = await User.findByIdAndUpdate(id, { age }) //Since age : age and age is same.
    const count = await User.countDocuments({ age })
    return count
}

updateAgeCount('62e2b9c7eafbb1f74ab74d6b', 2).then((user) => {
    console.log(user)
}).catch((error) => {
    consolelog(error)
})