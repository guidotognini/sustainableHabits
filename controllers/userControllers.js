// Importing necessary modules and functions
const asyncHandler = require("express-async-handler"); // Middleware for handling asynchronous errors
const { User, UsersHabits } = require("../models/models.js"); // Importing the User model
const { Op } = require("sequelize"); // Sequelize operators
const validator = require("validator"); // Validation library
const { createTokens, validateToken } = require("../JWT.js"); // Functions for JWT token creation and validation
const bcrypt = require("bcrypt"); // Library for password hashing
const cookieParser = require("cookie-parser"); // Middleware for parsing cookies

// Number of salt rounds for password hashing
const saltRounds = 10;

// Controller function for user registration
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body; // Extracting username, email, and password from request body

  // Validating input fields
  if (!username || !email || !password || !validator.isEmail(email)) {
    res.status(400);
    throw new Error("Invalid email or incomplete fields");
  }

  // Checking if username or email already exists in the database
  const existingUser = await User.findOne({
    where: { [Op.or]: [{ username: username }, { email: email }] },
  });
  if (existingUser) {
    res.status(400);
    throw new Error("Username or email already in use");
  }

  // Hashing the password before storing it in the database
  const hash = await bcrypt.hash(password, saltRounds);

  // Creating a new user record in the database
  const user = await User.create({ username, email, password: hash });
  if (user) {
    res
      .status(201)
      .json({
        message: `User with the email ${email} and username ${username} registered successfully!`
      });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
});

// Controller function for user login
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body; // Extracting username and password from request body

  // Validating input fields
  if (!username || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  // Finding user by username in the database
  const user = await User.findOne({ where: { [Op.or]: [{username: username}, {email: username}] } });
  if (!user) {
    // If user not found, return error response
    res.status(404);
    throw new Error("User not found!");
  }

  // Comparing password provided by user with hashed password stored in the database
  const dbPassword = user.password;
  const match = await bcrypt.compare(password, dbPassword);
  if (!match) {
    // If passwords don't match, return error response
    res.status(400);
    throw new Error("Password does not match");
  } else {
    // If login successful, create JWT token for authentication
    const accessToken = createTokens(user);

    // Set token as a cookie in the response
    res.cookie("access-token", accessToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000, // Token expiration time (30 days)
      httpOnly: true, // Cookie is accessible only by the server
    });

    // Return success message
    res.status(200).json({ message: "User logged in" });
  }
});

// Logout controller function
const logout = (req, res) => {
  res.clearCookie("access-token");
  res.status(200).send("Logout successful");
};

// Controller function to retrieve information about the current user
const profile = asyncHandler(async (req, res) => {
  const user = await User.findOne({ where: { id: req.userId } });
  res
    .status(200)
    .json({ userId: req.userId, username: user.username, email: user.email });
});

// Controller function to update user profile
const updateProfile = asyncHandler(async (req, res) => {
  const { username, email } = req.body;

  // Validating input fields
  if (!username && !email) {
    res.status(400);
    throw new Error("Please fill up at least one of of the fields to make changes");
  } else if(!validator.isEmail(email)) {
    res.status(400);
    throw new Error("Please use a valid email address");
  }

  const user = await User.findByPk(req.userId);

  let existingUser;

  // Checking if username or email already exists in the database
  if(username && email) {
    existingUser = await User.findOne({
      where: { [Op.or]: [{ username: username }, { email: email }] },
    });
  } else if(username) {
    existingUser = await User.findOne({
      where: { username: username }
    });
  } else {
    existingUser = await User.findOne({
      where: { email: email }
    });
  };

  if (existingUser) {
    res.status(400);
    throw new Error("Username or email already in use");
  }

  // Updating user's username and email if provided
  if (username) {
    user.username = username;
  }
  if (email) {
    user.email = email;
  }
  
  // Saving updated user information to the database
  await user.save({ fields: ["username", "email"] });

  // Sending success response with updated user information
  res
    .status(200)
    .json({
      message: "User updated successfully",
      "User info": { username: user.username, email: user.email },
    });
});

// Exporting controller functions for use in other parts of the application
module.exports = { register, login, logout, profile, updateProfile };