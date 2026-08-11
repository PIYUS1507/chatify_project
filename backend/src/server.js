// const express = require('express')
import dotenv from "dotenv"
import express from "express"
import authRoute from "./routes/auth.routes.js"
import messageRoute from "./routes/message.routes.js"
import { connextionDB } from "./lib/db.js"


dotenv.config()
const app = express()
app.use(express.json())

app.use("/api/auth",authRoute)
app.use("/api/message",messageRoute)


// console.log(process.env.PORT)


const start = async () => {
    await connextionDB()
    app.listen(process.env.PORT || 3000, ()=>{
        console.log(`the server is listening on the port ${process.env.PORT || 3000}`)
    })
}

start()