import { verifyEmail } from "../emailVerfication/email.verify.js";
import User from "../Models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import Session from "../Models/session.model.js"
import { sendOtpMail } from "../emailVerfication/sendOtpMail.js";
const registerUser=async(req,res)=>{
    try {
        const {username,email,password}=req.body;
        if(!email||!username||!password){
            return res.status(400).json(
                {
                    success:false,
                    message:"All fields are required"
                }
            )
        }
        const existingUser=await User.findOne({email})
        if (existingUser){
            return res.status(400).json({
                success:false,
                message:"The User Already Exists"
            })
        }
        const hashedPassword=await bcrypt.hash(password,10)
        const newUser=await User.create({
            email,
            password:hashedPassword,
            username
        })
        const token=await jwt.sign({id:newUser._id},process.env.SECRET_KEY,{expiresIn:"10m"})
        verifyEmail(token,email)
        newUser.token = token;
        await newUser.save()
        return res.status(201).json({
            success:true,
            message:"User is registered sucessfully",
            data:newUser 
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
const verification=async(req,res)=>{
    try {
        const authHeader=req.headers.authorization;
        if(!authHeader||!authHeader.startsWith("Bearer")){
            return res.status(401).json({
                success:false,
                message:"Auhtorization Token is Missing or invalid"
            })
        }
        const token=authHeader.split(" ")[1];

        let decoded;
        try {
            decoded=jwt.verify(token,process.env.SECRET_KEY)
        } catch (error) {
            if(error.name==="TokenExpiryError"){
                return res.status(400).json({
                    success:false,
                    message:"The registration token has expired"
                })
            }
            return res.status(400).json({
                success:false,
                message:"Token Verfication Failed"
            })
        }
        const user=await User.findById(decoded.id)
        if(!user){
            res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        user.token=null
        user.isVerified=true;
        await user.save();

        return res.status(200).json({
            success:true,
            message:"Email Verified Successfully"
        })
    } catch (error) {
        
    }
}
const loginUser=async(req,res)=>{
        try {
            const {email,password}=req.body;
            if(!email||!password){
                res.status(400).json({
                    success:false,
                    message:"All fields are required"
                })
            }
            const user=await User.findOne({email})
            if(!user){
                res.status(401).json({
                    success:false,
                    message:"Unauthorized Access"
                })
            }
            const passwordCheck=await bcrypt.compare(password,user.password)
            if(!passwordCheck){
                res.status(402).json({
                    success:false,
                    message:"Incorrect Password"
                })
            }
            if(await user.isVerified!==true){
                res.status(403).json({
                    success:false,
                    message:"Login After Being Verified"
                })
            }
            //check for existing session and delete it
            const exisitingSession=await Session.findOne({userId:user._id})
            if(exisitingSession){
            await Session.deleteOne({userId:user._id}) 
            }
            //create Session
            await Session.create({userId:user._id})

            //Generate Token
            const accessToken=jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn:"10d"})
            const refreshToken=jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn:"30d"})

            user.isLoggedIn=true;
            await user.save();
            res.status(200).json({
                success:true,
                message:`Welcome Back,${user.username}`,
                accessToken,
                refreshToken,
                data:user
            })
        } catch (error) {
            res.status(500).json({
                success:false,
                message:error.message
            })
        }
}
const logOutUser = async (req, res) => {
    try {
        const userId = req.userId;
        await Session.deleteMany({ userId });
        await User.findByIdAndUpdate(userId, { isLoggedIn: false })
        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};
const forgotPassword=async(req,res)=>{
    try {
        const {email}=req.body;
        const user=await User.findOne({email})
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        const otp=Math.floor(10000+Math.random()*900000).toString();
        const expiry= new Date(Date.now()+10*60*1000);

        user.otp=otp;
        user.otpExpiry=expiry;
        await user.save();
        await sendOtpMail(email,otp);
        return res.status(200).json({
            success:true,
            message:"OTP sent sucessfully"
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
const verifyOtp=async(req,res)=>{
    try {
        const {otp}=req.body;
        const email=req.params.email;
        if(!otp){
            return res.status(400).json({
                success:false,
                message:"OTP is required"
            })
        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        if(!user.otp||!user.otpExpiry){
            return res.status(400).json({
                success:false,
                message:"OTP not generated or already verified"
            })
        }
    
        if(user.otpExpiry<new Date()){
            return res.status(400).json({
                success:false,
                message:"OTP has expired.Please request a new one"
            })
        }
        if(otp!==user.otp){
            return res.status(400).json({
                success:false,
                message:"Invalid OTP"
            })
        }
        user.otp=null;
        user.otpExpiry=null;
        await user.save();
        return res.status(200).json({
            success:true,
            message:"OTP verified successfully"
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
            
        })
        
    }
}

const resetPassword=async(req,res)=>{
    const {newPassword,confirmPassword}=req.body;
    const email=req.params.email;
    if(!newPassword||!confirmPassword){
        return res.status(400).json({
            success:false,
            message:"All fields are required"
        })
    }

    if(newPassword!==confirmPassword){
        return res.status(400).json({
            success:false,
            messsage:"Password don't match."
        })
    }

    try {
        const user= await User.findOne({email});
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        const hashedPassword=await bcrypt.hash(newPassword,10)
        user.password=hashedPassword;

        await user.save();
        return res.status(200).json({
            success:true,
            message:"Password changed successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}
export {
    registerUser,
    verification,
    loginUser,
    logOutUser,
    forgotPassword,
    verifyOtp,
    resetPassword
}