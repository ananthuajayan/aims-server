const userModel = require("../model/userModel");
const argon = require("argon2");


const getUser = async (req, res) => {
  try {
    // Fetch users from the database
    const users = await userModel.findAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


const getUserById = async (req, res) => {
  try {
    // Fetch user by ID from the database
    const user = await userModel.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


const createUser = async (req, res) => {
  const {
    user_name,
    user_last_name,
    user_email,
    user_role,
    user_mobile,
    user_password,
    confirm_password,
  } = req.body;
  if (user_password !== confirm_password) {
    return res
      .status(400)
      .json({ msg: "confirm password doesn't match with the password" });
  }
  try {
    // Hash the password before saving it
    const hashedPassword = await argon.hash(user_password);
    // Create a new user in the database
    const user = await userModel.createUser(
      user_name,
      user_last_name,
      user_email,
      user_role,
      user_mobile,
      hashedPassword
    );
    res.status(201).json({ msg: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { user_name, user_last_name, user_email, user_role, user_mobile, user_password } = req.body;

  try {
    // Check if the user exists before attempting to update
    const existingUser = await userModel.getUserById(userId);
    if (!existingUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Perform the update operation
    const updated = await userModel.updateUser(userId, user_name, user_last_name, user_email, user_role, user_mobile, user_password);
    if (updated) {
      res.status(200).json({ msg: "User updated successfully" });
    } else {
      res.status(500).json({ msg: "Failed to update user" });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await userModel.getUserById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const deleted = await userModel.deleteUser(userId);
    if (deleted) {
      res.status(200).json({ msg: "User deleted successfully" });
    } else {
      res.status(500).json({ msg: "Failed to delete user" });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


module.exports = { getUser, getUserById, createUser, updateUser, deleteUser };
