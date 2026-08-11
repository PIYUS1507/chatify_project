import jwt from 'jsonwebtoken'


export const generateToken = async (userId, res) => {
    if(!process.env.JWT_SECRET)
    {
        throw new Error("the jwt secret is not set")
    }
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httponly: true,
        sameSite: "strict"
    })
    return token
}