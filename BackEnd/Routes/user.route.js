import express from "express"
import {loginUser, registerUser,verification,logOutUser,forgotPassword,verifyOtp, resetPassword} from "../Controllers/user.controller.js"
import  isAuthenticated  from "../MiddleWare/isAuthenticated.js";
import { userSchema, validateUser } from "../Validator/user.validator.js";


const userRouter=express.Router()

userRouter.post("/register",validateUser(userSchema),registerUser );
userRouter.post("/verify",verification);
userRouter.post("/login",loginUser)
userRouter.post("/logout" ,isAuthenticated,logOutUser)
userRouter.post("/forgot-password",forgotPassword)
userRouter.post("/verify-otp/:email",verifyOtp)
userRouter.post("/reset-password/:email",resetPassword)
export default userRouter;