//Middleware for auth
// Without Middlewares : new request -> run route handler
// With MiddleWares : new request -> do something -> run route handler
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try{
        //Only when we provided correct authentication we can get the data!
        /*One drawback here, is that when user logins they can see email of all other users and all*/
        const token = req.header('Authorization').replace('Bearer ', '') //If Token isn't provided then catch will be gone
        const decoded = jwt.verify(token, process.env.JWT_SECRET) //Verify token with secret key
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token}) //Check if user with above decoded Id exists or not
        if(!user){
            throw new Error()    
        }
        req.token = token
        req.user = user
        next()
    }catch(e){
        res.status(401).send('Invalid Token. Authenticate first!')
    }
}

module.exports = auth