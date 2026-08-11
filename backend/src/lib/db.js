import mongoose from "mongoose"

export const connextionDB = async()=>{

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log("database connected successfully: ",conn.connection.host)
        // console.log(conn.connection.host)
        
    } catch (error) {
        console.log("problem during connection to the database: "+error)
        process.exit(1)
    }
}