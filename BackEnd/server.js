import express from "express"
import "dotenv/config"
import connectDB from "./DataBase/db.js";
import userRouter from "./Routes/user.route.js";
import cors from "cors"
const app=express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin:"http://localhost:5143",
    credentials:true
}))


app.use("/user",userRouter);


const PORT=process.env.PORT||8000




app.listen(PORT,()=>{
    connectDB()
    console.log(`Server is running at PORT ${PORT}`)
})
