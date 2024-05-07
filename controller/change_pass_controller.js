const changePasswordModal = require('../model/change_pass_model');
const bcrypt = require('bcrypt');


const changePassword = async (req,res)=>{
   try {
    const {user_email,password,ConfirmPassword} = req.body
    if(!user_email || !password || !ConfirmPassword){
        return res.send({
            result:false,
            message:"insufficient parameters"
        })
    }

    var checkUser = await changePasswordModal.checkUsers(user_email)
      if(!checkUser){
        return res.status(201).json({
            message:"user email cannot be found"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await changePasswordModal.updatePassword(user_email, hashedPassword);
     
    if(result.affectedRows > 0){
        return res.status(200).json({
            message:"password updated succesfully"
        })
    }
    else{
        return res.status(500).json({
            message:"failed to update password"
        })
    }
    
   } catch (error) {
    console.error("Change password failed:", error);
    res.status(500).json({ message: error.message });
   }
 
}
module.exports = {changePassword}