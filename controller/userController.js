const userModel = require("../model/userModel");
const argon = require("argon2");
const nodemailer = require('nodemailer');

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

  // Check if the passwords match
  if (user_password !== confirm_password) {
    return res
      .status(400)
      .json({ msg: "confirm password doesn't match with the password" });
  }

  try {
    // Check if the user already exists
    const existingUser = await userModel.getUserByEmail(user_email);
    if (existingUser === false) {
      // Hash the password before saving it
      const hashedPassword = await argon.hash(user_password);

      // Create a new user in the database
      const userId = await userModel.createUser(
        user_name,
        user_last_name,
        user_email,
        user_role,
        user_mobile,
        hashedPassword,
      );

      // Send verification email
      const mailOptions = {
        from: 'info@lunarenp.com',
        to: user_email,
        subject: 'Email Verification',
        text: 'Please verify your email address by clicking the following link:',
        html: '<p>Please click <a href="http://yourverificationlink.com">here</a> to verify your email address.</p>',
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending verification email:", error);
          return res.status(500).json({ msg: "Failed to send verification email" });
        } else {
          console.log("Verification email sent:", info.response);
          res.status(201).json({ msg: "User created successfully", userId });
        }
      });
    } else {
      res.status(400).json({ msg: "User already registered" });
    }
  } catch (error) {
    // Check if the error is due to a duplicate email constraint violation
    if (error.code === "SQLITE_CONSTRAINT" && error.message.includes("UNIQUE constraint failed")) {
      return res.status(400).json({ msg: "User with this email already exists" });
    }
    console.error("Error creating user:", error);
    res.status(500).json({ msg: "Failed to create user" });
  }
};

const logInUser = async (req, res) => {
  try {
    const { user_email, user_password } = req.body;

    // Validate email and password
    if (!user_email || !user_password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Call the userModel.logUser function with an object containing email and password
    const user = await userModel.logUser({ user_email, user_password });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // If user is found, send a success response with user details
    res.status(200).json({ message: "Login successful", user: {
      userName: user_email,
    } });
  } catch (error) {
    // If an error occurs, send an error response
    console.error("Login failed:", error.message);
    res.status(500).json({ error: "Login failed" });
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


module.exports = { getUser, getUserById,logInUser, createUser, updateUser, deleteUser };
