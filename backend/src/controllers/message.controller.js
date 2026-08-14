import cloudinary, { uploadImageonCloude } from "../lib/cloudinary.js";

import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";

export const getAllContacts = async (req, res) => {
    try {
        const LoggedInUserId = req.user._id;
        const filtereduser = await User.find({
            _id: {
                $ne: LoggedInUserId
            }
        }).select("-password")
        return res.status(200).json(filtereduser);

    } catch (error) {
        console.log("Error in getAllContacts ", error);
        return res.status(500).json({ message: "Server issue" })
    }
}

export const getMessageByUseraId = async (req, res) => {
    try {
        const myId = req.user._id;
        const { id: userId } = req.params;
        const message = await Message.find({
            $or: [
                { senderId: userId, receiverId: myId },
                { senderId: myId, receiverId: userId }
            ]
        })
        return res.status(200).json(message)

    } catch (error) {
        console.log("The error during the fetching the message ", error)
        return res.status(500).json({ message: "Internal Server error" })
    }
}


export const sendMessage = async (req, res) => {
    try {
        const text = req.body
        const  image  = req.file?.path
        const { id: receiverId } = req.params
        const senderId = req.user._id

        let imageUrl = "";
        if (image) {
            const uploadedresponse = await uploadImageonCloude(image)
            if (!uploadedresponse) {
                return res.status(400).json({ message: "Error while uploading the file" })
            }
            imageUrl = uploadedresponse
        }

        const newMessage = await Message({
            senderId: senderId,
            receiverId: receiverId,
            text: text,
            image: imageUrl
        })
        await newMessage.save()

        res.status(201).json(newMessage)

    }
    catch (error) {
        console.log("error while sending the message ", error)
        return res.status(500).json({ message: "Internal Server error" })
    }
}

export const getChatPartners = async (req, res) => {
    try {
        const LoggedInUserId = req.user._id;
        const message = await Message.find({
            $or: [
                { senderId: LoggedInUserId }, { receiverId: LoggedInUserId }
            ]
        })


        const chatPartners = [
            ...new Set(
                message.map((msg) => {
                    msg.senderId.toString() === LoggedInUserId.toString() ?
                        msg.receiverId.toString() : msg.senderId.toString()
                })
            )
        ]
        return res.status(200).json({chatPartners})
    } catch (error) {
        console.error("Error in getChatPartners: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}
