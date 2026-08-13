import { v2 as cloudinary } from "cloudinary";
import "dotenv/config"
import fs from "fs"
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export const uploadImageonCloude = async(filepath)=>{
    try {
        if (!filepath) {
            return null
        }
        const response = await cloudinary.uploader.upload(filepath,{
            resource_type:'auto'
        })
        console.log("the photo is uploaded properly ",response.url)
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath)
        }
        return response.secure_url


    } catch (error) {
        if (filepath && fs.existsSync(filepath)) {
            fs.unlinkSync(filepath)
        }
        console.log("error while uploading the image", error)
        return null
    }
}

export default cloudinary