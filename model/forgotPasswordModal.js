var connection = require("../dbConnection");
var util = require("util");
var query = util.promisify(connection.query).bind(connection);

  const  getVerificationRecord = async (user_id) => {
    try {
      var Query = "SELECT * FROM master_user_email_verification WHERE user_email_varification_user_id = ?";
      var [rows] = await query(Query, [user_id]);
      return rows && rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  };
  
const insertVerificationQuery = async (user_id, token) => {
    var insertQuery = `insert into master_user_email_verification(user_email_varification_user_id,user_email_verification_token)values(?,?)`;
    var data =await query(insertQuery, [user_id, token]);
    return data;
  };

const updateVerificationQuery = async (token,user_id) => {
    var Query = "UPDATE master_user_email_verification SET user_email_verification_token = ? WHERE user_email_varification_user_id = ?";
    var data =await query(Query, [token,user_id]);
    return data;
  };

  const getUserByEmail = async (user_email) => {
    try {
      var Query = "SELECT * FROM aims_user WHERE user_email = ?";
      var rows = await query(Query, [user_email]);
      if (!rows || rows.length === 0) {
        return false; 
      }
      return rows[0]; 
    } catch (error) {
      throw error;
    }
  };

  module.exports = { getUserByEmail,insertVerificationQuery,updateVerificationQuery,getVerificationRecord };
