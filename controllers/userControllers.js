// Importing necessary modules and functions
const asyncHandler = require('express-async-handler'); // Importing a utility middleware for handling asynchronous errors
const { User, UsersHabits } = require("../models/models.js"); // Importing the User model
const { Op } = require("sequelize"); // Importing Sequelize operators
const validator = require('validator'); // Importing a validation library
const { createTokens, validateToken } = require('../JWT.js'); // Importing functions for JWT token creation and validation
const bcrypt = require("bcrypt"); // Importing the bcrypt library for password hashing
const cookieParser = require('cookie-parser');

// Number of salt rounds for password hashing
const saltRounds = 10;

// Controller function for user registration
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body; // Extracting username, email, and password from request body
  // Validating input fields
  if (!username || !email || !password || !validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email or incomplete fields" });
  }
  // Checking if username or email already exists in the database
  const existingUser = await User.findOne({
    where: { [Op.or]: [{ username: username }, { email: email }] },
  });
  if (existingUser) {
    return res.status(400).json({ message: "Username or email already in use" });
  }
  // Hashing the password before storing it in the database
  const hash = await bcrypt.hash(password, saltRounds);
  // Creating a new user record in the database
  const user = await User.create({ username, email, password: hash });
/*   for (let i = 1; i <= 10; i++) {
    await UsersHabits.create({ user_id: user.id, habit_id: i });
  } */
  res.status(201).send(`User with the email ${email} registered successfully!`);
});

// Controller function for user login
const login =asyncHandler(async (req, res) => {
  const { username, password } = req.body; // Extracting username and password from request body
  // Finding user by username in the database
  const user = await User.findOne({ where: { username: username } });
  if (!user) {
    // If user not found, return error response
    res.status(404).json({ message: "User not found!" });
  }
  // Comparing password provided by user with hashed password stored in the database
  const dbPassword = user.password;
  const match = await bcrypt.compare(password, dbPassword);
  if (!match) {
    // If passwords don't match, return error response
    res.status(400).json({ error: "Password doesn't match" });
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

const logout = (req, res) => {
  res.clearCookie('access-token')
  res.send('Logout successful');
};

// Controller function to retrieve information about the current user
const profile = asyncHandler(async(req, res) => {
  user = await User.findOne({where: {id: req.userId}});
  res.status(200).json({"userId": req.userId, "username": user.username, "email": user.email});
});

const updateProfile = async(req,res)=>{
  const {username, email} = req.body;
  const user = await User.findByPk(req.userId);
  const existingUser = await User.findOne({
    where: { [Op.or]: [{ username: username }, { email: email }] },
  });
  if (existingUser) {
    return res.status(400).json({ message: "Username or email already in use" });
  }
  if(username) {
    user.username = username;
  }
  if(email) {
    user.email = email;
  }
  await user.save({fields: ['username', 'email']});
  res.status(200).json({"message": "User updated successfully", "User info": {"username": user.username, "email": user.email}})
}

// Exporting controller functions for use in other parts of the application
module.exports = { register, login, logout, profile, updateProfile};
