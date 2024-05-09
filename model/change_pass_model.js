var connection = require("../dbConnection");
var util = require("util");
var query = util.promisify(connection.query).bind(connection);

const updatePassword = async (user_email, hashedPassword) => {
    try {
        const updateQuery = "UPDATE aims_user SET user_password = ? WHERE user_email = ?";
        const result = await query(updateQuery, [hashedPassword, user_email]);
        return result;
    } catch (error) {
        throw error;
    }
};

const checkUsers = async (user_email) => {
    try {
      var Query = "SELECT * FROM aims_user WHERE user_email = ?";
      var users = await query(Query, [user_email]);
      return users;
    } catch (error) {
      throw error;
    }
};


module.exports={updatePassword,checkUsers}