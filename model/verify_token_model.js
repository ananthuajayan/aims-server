var connection = require("../dbConnection");
var util = require("util");
var query = util.promisify(connection.query).bind(connection);

const CheckUser = async(email)=> {
    var userQuery = `SELECT * FROM aims_user WHERE user_email = ? and user_status = 'active'`;
    var data = await query(userQuery,[email]);
    return data;
};
const VerifyUser = async(user_id,token) => {
  var Query =`select * from master_user_email_verification where user_email_varification_user_id =? and user_email_verification_token =? `;
  var data = query(Query,[user_id,token]);
  return data;
};

      

module.exports = {CheckUser,VerifyUser}