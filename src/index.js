// require('dotenv').config( {path :'/.env'})
import dotenv from "dotenv"
import connectDb from "./db/index.js"
import app from "./app.js"

dotenv.config(
    {path : '/.env'}
)
connectDb()
.then(()=>{
    app.listen(process.env.PORT||8000 , ()=>{
        console.log("server in running on port",`${process.env.PORT}`)
    })   
    app.on("error" , (error)=>{
        console.error(error)
        process.exit(1)
    }) 
})
.catch((error)=>{
    console.error ("DATA BASE CONNECTION ERROR",error) ;
})
// import mongoose from mongoose ;
// import { DB_NAME } from "./constants";
// import express from express ;
// const app = express()

// ( async ()=>{
//     try {
//         await mongoose.connect( `${ process.env.MONGODB_URI }/${ DB_NAME }` )
//         app.on("error",(error)=>{
//             console.log("ERROR",error)
//             throw error             
//         })
//         app.listen(process.env.PORT , ()=>{
//             console.log(`App is listning on port : ${process.env.PORT}`)
//         })
//     } catch (error) {

//         console.error("ERROR",error) 
//         throw err
//     }
// })()