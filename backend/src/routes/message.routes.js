import express from "express"
import { getAllContacts, getChatPartners, getMessageByUseraId, sendMessage } from "../controllers/message.controller.js"
// import { protectSignup } from "@arcjet/node"
import { arcjetProtection } from "../middleware/arcjet.middleware.js"
import { authchecker } from "../middleware/auth.middleware.js"
import { upload } from "../middleware/multer.middleware.js"

const router = express.Router()

router.use(authchecker)
// router.use(arcjetProtection)

router.get('/contacts',getAllContacts)
router.get('/chat',getChatPartners)
router.get('/:id',getMessageByUseraId)
router.post("/send/:id",upload.single("image"),sendMessage)


// router.get("/getmessage", (req, res) => {
//     res.send("get message page")
// })


export default router