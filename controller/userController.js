const userModel = require("../model/userModel");
const nodemailer = require('nodemailer');
var bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

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
      var salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user_password, salt);

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
        html: `<p>Please <a href="https://lunarsenterprises.com:4000/mail-verification/${userId}">click here</a> for verification to verify your email address.</p>
        `,
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

    const user = await userModel.logUser(user_email);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const checkPassword = await bcrypt.compare(user_password, user.user_password);
    if (!checkPassword) {
      return res.status(401).json({ message: "Password is wrong, please check your password and try again" });
    }

    const payload = {
      user_email: user.user_email,
      username: user.user_name
    };

    const token = jwt.sign(
      payload,
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: "Login successful",
      user: {
        userName: user.user_name,
        email: user.user_email,
      },
      token: token
    });
  } catch (error) {
    console.error("Login failed:", error.message);
    res.status(500).json({ message: error.message });
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

var MailVerification = async (req, res) => {
  var user_id = req.params.id;
  var data = await userModel.UpdateMailverify(user_id);
  if (data == true) {
    return res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Registration Success</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                text-align: center;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #7bd148;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            h1 {
                color: #fff;
            }
            p {
                color: #fff;
                margin-bottom: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Registration Successful!</h1>
            <p>Your account has been successfully registered. You can now login using your credentials.</p>
        </div>
    </body>
    </html>
    `);
  } else {
    return res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Registration Failed</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                text-align: center;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ff6363; /* Red color */
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            h1 {
                color: #fff; /* White text */
            }
            p {
                color: #fff; /* White text */
                margin-bottom: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Registration Failed</h1>
            <p>Sorry, registration failed. Please try again.</p>
        </div>
    </body>
    </html>
    `);
  };

};

module.exports = { getUser, getUserById, logInUser, createUser, updateUser, deleteUser, MailVerification };
