import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js'

export const authchecker = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(400).json({ message: "The token is invalid" })
    }
    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) {
            return res.status(400).json({ message: "The token is invalid" })
        }
        const user = await User.findById(decoded.userId).select("-password")
        if (!user) {
            return res.status(400).json({ message: "The token is invalid" })
        }
        req.user = user
        next()


    } catch (error) {
        console.log("Error while fetching the token ", error)
        return res.status(500).json({ message: "Server error during the cookie" })
    }
}