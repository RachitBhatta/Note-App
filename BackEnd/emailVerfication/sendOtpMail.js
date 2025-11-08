import nodemailer from "nodemailer"
import "dotenv/config"
import { getOtpEmailTemplate } from "./OPT.js"

const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.MAIL_USER,
            pass:process.env.MAIL_PASS
        }
})

export const sendOtpMail=async(email,otp)=>{ 
    try {
        const expiryDate = new Date(Date.now() + 10 * 60 * 1000);
        const expiryTime = expiryDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        const htmlContent = getOtpEmailTemplate(otp, expiryTime);
        const mailOptions={
            from:process.env.MAIL_USER,
            to:email,
            subject:"Password Reset OTP",
            html:htmlContent,
            text: `Your OTP code is: ${otp}\n\nValid for 10 minutes until ${expiryTime}\n\nIf you didn't request this, please ignore this email.\n\n- NextGen Technology`
        }
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error(`Failed to send OTP email: ${error.message}`);
    }
}
