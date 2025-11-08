import mongoose from "mongoose";

const connectDB=async()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URL}/note-app`);
        console.log("MongoDB connected");
    } catch (error) {
        console.log("MongoDB connection error go to db.js",error);
    }
}


export default connectDB;