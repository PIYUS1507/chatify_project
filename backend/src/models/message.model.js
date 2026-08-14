import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    tex:{
        type:String,
    },
    image:{
        type:String,
        default:""
    }

},{timestamps:true})


export const Message = mongoose.model("Message",messageSchema)