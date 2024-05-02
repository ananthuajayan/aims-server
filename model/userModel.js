const connection = require("../dbConnection");
const util = require("util");
const query = util.promisify(connection.query).bind(connection);


const getUserByEmail = async (user_email) => {
  try {
    const Query = "SELECT * FROM aims_user WHERE user_email = ?";
    const [rows] = await query(Query, [user_email]);

    if (!rows || rows.length === 0) {
      return false; // Return false to indicate that email is not found
    }

    return rows[0];
  } catch (error) {
    throw error;
  }
};

const createUser = async (user_name, user_last_name, user_email, user_role, user_mobile, user_password) => {
  try {
    const Query = "INSERT INTO aims_user (user_name, user_last_name, user_email, user_mobile, user_role, user_password) VALUES (?, ?, ?, ?, ?, ?)";
    const result = await query(Query, [user_name, user_last_name, user_email, user_mobile, user_role, user_password]);
    return result.insertId;
  } catch (error) {
    throw error;
  }
};

const logUser = async ({ user_email, user_password }) => {
  try {
    console.log("Email:", user_email);
    console.log("Password:", user_password);

    const queryString = "SELECT * FROM aims_user WHERE user_email = ? AND user_password = ?";
    console.log("Query:", queryString);

    const result = await connection.query(queryString, [user_email, user_password]);
    console.log("Query Result:", result);

    if (result.length === 0) {
      throw new Error("Invalid email or password");
    }

    return result[0];
  } catch (error) {
    console.error("Error in logUser:", error);
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

module.exports = { getUserByEmail,createUser,findAllUsers,getUserById,deleteUser,updateUser,logUser };
