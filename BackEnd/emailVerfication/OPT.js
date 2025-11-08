export const getOtpEmailTemplate = (otp, expiryTime) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification - NextGen Technology</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden;">
                    
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <!-- CENTERED LOGO -->
                            <table cellpadding="0" cellspacing="0" style="margin: 0 auto 20px;">
                                <tr>
                                    <td style="background-color: white; width: 100px; height: 100px; border-radius: 50%; box-shadow: 0 4px 15px rgba(0,0,0,0.1); text-align: center; vertical-align: middle;">
                                        <!-- Replace with your logo URL or use NG initials -->
                                        <span style="font-size: 32px; font-weight: bold; color: #667eea; line-height: 100px;">NG</span>
                                    </td>
                                </tr>
                            </table>
                            <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 600;">NextGen Technology</h1>
                            <p style="margin: 8px 0 0 0; color: #e0e7ff; font-size: 13px; letter-spacing: 0.5px;">SECURE VERIFICATION</p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 40px 35px;">
                            <h2 style="margin: 0 0 15px 0; color: #1a202c; font-size: 22px; font-weight: 600;">Verify Your Identity</h2>
                            <p style="margin: 0 0 25px 0; color: #4a5568; font-size: 15px; line-height: 1.6;">
                                We received a request to reset your password. Use the One-Time Password below to proceed:
                            </p>

                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0;">
                                <tr>
                                    <td align="center">
                                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 30px;">
                                            <p style="margin: 0 0 10px 0; color: #e0e7ff; font-size: 13px; font-weight: 500; letter-spacing: 1px;">YOUR OTP CODE</p>
                                            <h1 style="margin: 0 0 8px 0; color: #ffffff; font-size: 44px; font-weight: 700; letter-spacing: 10px; font-family: 'Courier New', monospace; user-select: all;">${otp}</h1>
                                            <p style="margin: 0; color: #e0e7ff; font-size: 12px;">
                                                Tap to select and copy
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 25px 0; color: #e53e3e; font-size: 15px; text-align: center; line-height: 1.6;">
                                ⏱️ <strong>This OTP is valid for 10 minutes only</strong><br>
                                <span style="color: #718096; font-size: 14px;">Expires at ${expiryTime}</span>
                            </p>

                            <p style="margin: 25px 0 0 0; color: #718096; font-size: 14px; line-height: 1.6; text-align: center;">
                                If you didn't request this, please ignore this email or contact our support team.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="background-color: #2d3748; padding: 25px 35px; text-align: center;">
                            <p style="margin: 0 0 10px 0; color: #cbd5e0; font-size: 14px;">
                                Need help? 
                                <a href="mailto:support@nextgentech.com" style="color: #9f7aea; text-decoration: none; font-weight: 600;">support@nextgentech.com</a>
                            </p>
                            <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                                © 2025 NextGen Technology. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
};

