import express from "express"

const router =express.Router()

router.get("/send",(req,res)=>{
    res.send("send page")
})
router.get("/getmessage",(req,res)=>{
    res.send("get message page")
})


export default router