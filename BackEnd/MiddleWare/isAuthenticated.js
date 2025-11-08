import jwt from "jsonwebtoken"
import User from "../Models/user.model.js";


const isAuthenticated=async(req,res,next)=>{
    try {
        const authHeader=req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                success:false,
                message:"Access token is missing or invalid"
            })
        }
        const token=authHeader.split(" ")[1];

        jwt.verify(token,process.env.SECRET_KEY,async(error,decoded)=>{
            if(error){
                if(error.name==="TokenExpiredError"){
                    return res.status(400).json({
                        success:false,
                        message:"Access Token has expired,use refresh token to generate again"
                    })
                }
                return res.status(400).json({
                    success:false,
                    message:"Access Token is Missing or Invalid"
                })
            }
            const {id}=decoded;

            const user = await User.findById(id);
            if(!user){
                return res.status(404).json({
                    success:false,
                    message:"User not found"
                })
            }
            req.user=user
            req.userId=user._id;
            next()
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
export default isAuthenticated;