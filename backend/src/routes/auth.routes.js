import express from "express"

const router =express.Router()

router.get("/login",(req,res)=>{
    res.send("login page")
})

router.get("/signup",(req,res)=>{
    res.send("sign up page")
})

router.get("/signin",(req,res)=>{
    res.send("sign in page")
})

router.get("/logout",(req,res)=>{
    res.send("logout page")
})


export default router