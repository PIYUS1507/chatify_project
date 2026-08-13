import express from "express"
import { signup, login, logout, updateProfile } from "../controllers/auth.controller.js"
import { authchecker } from "../middleware/auth.middleware.js"
import { upload } from "../middleware/multer.middleware.js"
const router = express.Router()


router.post("/signup", signup)

router.post("/login", login)


router.post("/update-profile", authchecker, upload.single('profilePic'), updateProfile)

router.post("/logout", logout)
router.get('/getuser', authchecker, (req, res) => {
    return res.status(200).json(req.user)
})

export default router