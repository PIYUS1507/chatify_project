import { User } from '../models/user.model.js'
import bcrypt from "bcryptjs"
import { generateToken } from '../lib/utils.js'
import { sendWelcomeEmail } from "../emails/emailHandlers.js"
import { uploadImageonCloude } from '../lib/cloudinary.js'


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
                await sendWelcomeEmail(savedUser.email, savedUser.fullName, process.env.CLIENT_URL)
            } catch (error) {
                console.log("error while sending the email", error)
            }

            return res.status(201)
                .json({
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    profilePic: newUser.profilePic
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

export const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ message: "all fields are required" })
    }
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "invalid credential" })
        }
        const isPassword = await bcrypt.compare(password, user.password)
        if (!isPassword) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }

        generateToken(user._id, res)
        return res.status(201)
            .json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic
            })

    } catch (error) {
        console.log("Error occured while login: ", error)
        return res.status(500).json({ message: "Error while Logging up" })
    }
}

export const logout = async (req, res) => {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ message: "The user Logged Out successfully" })
}

export const updateProfile = async (req, res) => {
    try {
        const profilePic = req.file?.path

        if (!profilePic) {
            return res.status(400).json({ message: "profile pic is not given" })
        }

        const uploadResponse = await uploadImageonCloude(profilePic)

        if (!uploadResponse) {
            return res.status(500).json({ message: "Error while uploading the image" })
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { profilePic: uploadResponse },
            { new: true }
        )

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.status(200).json({
            message: "The profile photo is updated",
            user: {
                _id: updatedUser._id,
                fullName: updatedUser.fullName,
                email: updatedUser.email,
                profilePic: updatedUser.profilePic
            }
        })
    } catch (error) {
        console.log("Error occurres while updating the profile ", error)
        return res.status(500).json({ message: "Error occurres while updating the profile" })
    }
}