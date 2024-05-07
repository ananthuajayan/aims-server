const tokenVerifyModal = require('../model/verify_token_model');

module.exports.verifyToken = async(req,res)=>{
    try {
    var token = req.body.token;
    var email = req.body.email;
    let checkuser = await tokenVerifyModal.CheckUser(email);
    if(checkuser.length > 0 ){
        let verifyuser = await tokenVerifyModal.VerifyUser(checkuser[0].user_id,token);
        
        if(verifyuser.length > 0){
            return res.send({
                result:true,
                message:"user verified"
            })
        }else{
            return res.send({
                result:false,
                message:"user not verified"
            })
        }
    }else{
        return res.send({
            result:false,
            message:"user not found"
        })
    }
} 
catch (error) {
        return res.send({
            result:false,
            message:error.message
        })
}

};