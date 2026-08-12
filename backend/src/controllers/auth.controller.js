import { User } from '../models/user.model.js'
import bcrypt from "bcryptjs"
import { generateToken } from '../lib/utils.js'
import { sendWelcomeEmail } from "../emails/emailHandlers.js"
export const signup = async (req, res) => {
    const { fullName, email, password } = req.body

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "required all the fields" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "password must be 8 charactes long" })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "User is already existed" });

        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName,
            email,
            password: hashPassword
        })
        if (newUser) {
            const savedUser = await newUser.save()
            generateToken(savedUser._id, res)
            try {
                await sendWelcomeEmail(savedUser.email,savedUser.fullName,process.env.CLIENT_URL)
            } catch (error) {
                console.log("error while sending the email", error)
            }
            return res.status(201)
                .json({
                    _id: savedUser._id,
                    fullName: savedUser.fullName,
                    email: savedUser.email,
                    profilePic: savedUser.profilePic
                })
        }
        else {
            return res.status(400).json({
                message: "Invalid user data"
            })
        }
    } catch (error) {
        console.log("the error occurred in controller js ", error)
        return res.status(500).json({ message: "the internal server error while signing up" })
    }

}