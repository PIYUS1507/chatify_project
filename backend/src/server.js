// const express = require('express')
import dotenv from "dotenv"
import express from "express"
import authRoute from "./routes/auth.routes.js"
import messageRoute from "./routes/message.routes.js"
import path from "path"

dotenv.config()
const app = express()

const __dirname = path.resolve()

app.use("/api/auth",authRoute)
app.use("/api/message",messageRoute)


// console.log(process.env.PORT)

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(process.env.PORT || 3000,()=>{
    console.log(`the server is listening on the port ${process.env.PORT || 3000}`)
})