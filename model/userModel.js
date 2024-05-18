var connection = require("../dbConnection");
var util = require("util");
var query = util.promisify(connection.query).bind(connection);


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

var createUser = async (user_name, user_last_name, user_email, user_role, user_mobile, user_password) => {
  try {
    var Query = "INSERT INTO aims_user (user_name, user_last_name, user_email, user_mobile, user_role, user_password) VALUES (?, ?, ?, ?, ?, ?)";
    var result = await query(Query, [user_name, user_last_name, user_email, user_mobile, user_role, user_password]);
    return result.insertId;
  } catch (error) {
    throw error;
  }
};

var logUser = async (user_email) => {
  try {
    var queryString = "SELECT * FROM aims_user WHERE user_email = ?";
    var result = await query(queryString, [user_email]);
    console.log("Query Result:", result);

    if (result.length == 0) {
      throw new Error("Invalid email, please check and try again");
    } else {
      if (result[0].email_verification == 'no') {
        throw new Error("Mail not verified, please check your mail and verify");
      }
      return result[0];  // Ensure result[0] contains username
    }
  } catch (error) {
    console.error("Error in logUser:", error);
    throw error;
  }
};

var findAllUsers = async () => {
  try {
    var Query = "SELECT * FROM aims_user";
    var users = await query(Query);
    return users;
  } catch (error) {
    throw error;
  }
};

var getUserById = async (userId) => {
  try {
    var Query = "SELECT * FROM aims_user WHERE user_id = ?";
    var user = await query(Query, [userId]);
    return user[0];
  } catch (error) {
    throw error;
  }
};

var deleteUser = async (userId) => {
  try {
    var Query = "DELETE FROM aims_user WHERE user_id = ?";
    var result = await query(Query, [userId]);
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

var updateUser = async (userId, user_name, user_last_name, user_email, user_role, user_mobile, user_password) => {
  try {
    var Query = "UPDATE aims_user SET user_name = ?, user_last_name = ?, user_email = ?, user_mobile = ?, user_role = ?, user_password = ? WHERE user_id = ?";
    var result = await query(Query, [user_name, user_last_name, user_email, user_mobile, user_role, user_password, userId]);
    return result.affectedRows > 0; // Check if any rows were affected (i.e., if the user was updated)
  } catch (error) {
    throw error;
  }
};

var UpdateMailverify = async (userId) => {
  try {
    var Query = "select * from aims_user where user_id =?";
    var result = await query(Query, [userId]);
    if (result.length > 0) {
      var Query1 = "update aims_user set email_verification =  ? where user_id =?";
      await query(Query1, ['yes', userId]);
      return true
    } else {
      return false
    }
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
}


module.exports = { getUserByEmail, createUser, findAllUsers, getUserById, deleteUser, updateUser, logUser, UpdateMailverify };

