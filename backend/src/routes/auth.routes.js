import express from "express"
import { signup, login, logout } from "../controllers/auth.controller.js"

const router = express.Router()


router.post("/signup", signup)

router.post("/login", login)


router.get("/signin", (req, res) => {
    res.send("sign in page")
})

router.post("/logout", logout)


export default router