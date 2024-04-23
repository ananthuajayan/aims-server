const connection = require("../dbConnection");
const util = require("util");
const query = util.promisify(connection.query).bind(connection);

const createUser = async (user_name, user_last_name, user_email, user_role, user_mobile, user_password) => {
  try {
    const Query = "INSERT INTO aims_user (user_name, user_last_name, user_email, user_mobile, user_role, user_password) VALUES (?, ?, ?, ?, ?, ?)";
    const result = await query(Query, [user_name, user_last_name, user_email, user_mobile, user_role, user_password]);
    return result.insertId;
  } catch (error) {
    throw error;
  }
};

const findAllUsers = async () => {
  try {
    const Query = "SELECT * FROM aims_user";
    const users = await query(Query);
    return users;
  } catch (error) {
    throw error;
  }
};

const getUserById = async (userId) => {
  try {
    const Query = "SELECT * FROM aims_user WHERE user_id = ?";
    const user = await query(Query, [userId]);
    return user[0]; 
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (userId) => {
  try {
    const Query = "DELETE FROM aims_user WHERE user_id = ?";
    const result = await query(Query, [userId]);
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};
const updateUser = async (userId, user_name, user_last_name, user_email, user_role, user_mobile, user_password) => {
  try {
    const Query = "UPDATE aims_user SET user_name = ?, user_last_name = ?, user_email = ?, user_mobile = ?, user_role = ?, user_password = ? WHERE user_id = ?";
    const result = await query(Query, [user_name, user_last_name, user_email, user_mobile, user_role, user_password, userId]);
    return result.affectedRows > 0; // Check if any rows were affected (i.e., if the user was updated)
  } catch (error) {
    throw error;
  }
};
module.exports = { createUser,findAllUsers,getUserById,deleteUser,updateUser };
