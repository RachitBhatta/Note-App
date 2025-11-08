import mongoose from "mongoose"

const userSchema=new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true,
        },
        isVerified:{
            type:Boolean,
            default:false
        },
        isLoggedIn:{
            type:Boolean,
            default:false
        },
        token:{
            type:String,
            default:null
        },
        otp:{
            type:String,
            default:null
        },
        otpExpiry:{
            type:Date,
            default:null
        },
        notes:{
            type:String
        }


},{timestamps:true});


const User=new mongoose.model("User",userSchema);

export default User