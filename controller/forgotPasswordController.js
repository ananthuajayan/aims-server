const userModel = require("../model/forgotPasswordModal");
const nodemailer = require('nodemailer');
var randtoken = require("rand-token").generator({
  chars: "0123456789",
});

let transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com", 
    port: 587,
    auth: {
      type: 'custom',
      method: 'PLAIN',
      user: 'info@lunarenp.com',
      pass: 'info123abcAB@',
    },
  });
  
  const forgotPassword = async (req, res) => {
    try {
      let { user_email } = req.body;
      if (!user_email) {
        return res.status(400).json({
          result: false,
          message: "Insufficient parameters",
        });
      }
  
      let user = await userModel.getUserByEmail(user_email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const resetToken = randtoken.generate(4);
  
      const existingVerificationRecord = await userModel.getVerificationRecord(user.user_id);
      if (existingVerificationRecord) {
        // Update the existing verification record
        await userModel.updateVerificationQuery(resetToken, user.user_id);
      } else {
        // Insert a new verification record
        await userModel.insertVerificationQuery(user.user_id, resetToken);
      }
  
      // Send reset email
      const mailOptions = {
        from: 'info@lunarenp.com',
        to: user_email,
        subject: 'Password Reset',
        text: `Your password reset token is: ${resetToken}`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending reset email:", error);
          return res.status(500).json({ message: "Failed to send reset email" });
        }
        console.log("Reset email sent:", info.response);
        res.status(200).json({ message: "Password reset email sent" });
      });
    } catch (error) {
      console.error("Forgot password failed:", error);
      res.status(500).json({ message: error.message });
    }
  };
  

  module.exports = {forgotPassword};
