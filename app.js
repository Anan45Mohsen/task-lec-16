
     const express = require ('express')

     const app = express()

     const port = process.env.PORT || 3000


    require('./db/mongoose')

 
    
    app.use(express.json())

    const userRouter = require("./routers/user")
    const taskRouter = require("./routers/task")

    app.use(userRouter)
    app.use(taskRouter)
    ///////////// logic of populate//////////////
//     const Task = require('./models/task')

//     const relationfun = async () =>{
//      const task = await Task.findById("6467a5fc9fd276cc85381ff5")
//      await task.populate('owner')
//      console.log(task)
//      console.log(task.owner)
//     }
//     relationfun()


    app.listen( port , () => {console.log("All Done Successfully")})






