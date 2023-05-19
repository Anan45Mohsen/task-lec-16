const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async(req , res , next )=>{
  try{
    const token = req.header('Authorization').replace('Bearer ','')
    console.log(token)
    const decode = jwt.verify(token,'anan105')
    console.log(decode)


    const user = await User.findOne({_id:decode._id , tokens:token})
    console.log(user)
    if(!user){
        throw new Error()
    }
    req.user = user
    req.token = token
    next()
  }
  catch(error){
    res.status(401).send({error:"please authenticate"})
  }
}
module.exports = auth
