
const express = require ('express')
const User = require('../models/user')
const router = express.Router()
// const session = require('express-session');
const auth =  require('../middleware/auth') 

 //////////////to make session///////////
//  router.use(session({
//     secret: 'anan105',
//     resave: false,
//     saveUninitialized: false
//   }));
  
////////////// post data/////////
router.post ('/users' , (req , res) => {
    console.log(req.body)

    const user = new User (req.body)

    user.save()
    .then ((user) => {res.status(200).send(user)})
    .catch((error)=>{ res.status(400).send(error)})
})
/////////////////////////////////Get data //////////////////////////////////////////////////////////
router.get('/users',auth , (req,res)=>{
    User.find({}).then((users)=>{
        res.status(200).send(users)
    }).catch((error)=>{
        res.status(500).send(error)
    })
})
/////////////////////////////////GET DATA BY ID ///////////////////////////////////////////////////////////
router.get('/users/:id',auth,(req,res)=>{
    console.log(req.params)
    const _id = req.params.id
    User.findById(_id).then((user)=>{
        if(!user){
           return res.status(404).send('Unable to find user')
        }
        res.status(200).send(user)
    }).catch((error)=>{
        res.status(500).send(error)
    })
})
///////////////////////////////////////////// Update or Patch data by ID/////////////////////////////////////////////// 

router.patch('/users/:id',auth ,async(req,res)=>{
    try{
        const updates = Object.keys (req.body)
        const _id = req.params.id
        const user = await User.findById (_id)
        if(!user){
            return res.status(404).send('No user is found')
        }
        updates.forEach((ele) => (user[ele] = req.body[ele]))
       await user.save()
      res.status(200).send(user)
    }
    catch(error){
        res.status(400).send(error)
    }
})
//////////////////////////////////Delete data by id ///////////////////////////////////////////////////////////
router.delete('/users/:id',auth ,async(req,res)=>{
    try{
        const _id = req.params.id
        const user = await User.findByIdAndDelete(_id)
        if(!user){
           return res.status(404).send('Unable to find user')
        }
        res.status(200).send(user)
    }
    catch(error){
        res.status(500).send(error)
    }
    })
//////////////////////LOGIN LOGIC///////////////////////////////////////////////////////////////////////
router.post('/login' , async (req,res)=>{
    try{
        const user = await User.findByCredentails(req.body.email,req.body.password)
        const token = await user.generateToken()

        res.status(200).send({user , token})
    }
    catch(error){
        res.status(400).send(error.message)
    }
})
////////////////// Post and generate token for each user ////////////
router.post('/users' , auth ,async (req , res)=>{
    try{
         const user = new User(req.body)
         const token = await user.generateToken()
         await user.save()
         res.status(200).send({user , token})
    }
    catch(error){
        res.status(400).send(error)
    }
})
/////////////// logic of get profile of user loged in /////////////////////
router.get('/profile' , auth , async(req , res)=>{
    res.status(200).send(req.user)
})
///////////////////// logout logic //////////////////
// router.post('/logout', (req, res) => {
//     req.session.user = null;
//     res.status(200).send("logout is successfully")
//   });

router.delete('/logout' , auth , async(req , res)=>{
    try{
        console.log(req.user)
        req.user.tokens = req.user.tokens.filter((el)=>{
            return el !== req.token
        })
        await req.user.save()
        res.send("logout sucessfully")
    }
    catch(error){
        res.status(500).send(error)
    }
})
///////////////////// logic of logout all/////////////
router.delete('/logoutAll',auth,async(req , res)=>{
    try{
    req.user.tokens = []
    await req.user.save()
    res.send("logout sucessfully")

    }
    catch(error){
        res.status(500).send(error)
    }

})
module.exports = router;
