// Importing necessary modules and functions
const { validateToken } = require('../JWT.js'); // Importing the token validation function from JWT.js
const { register, login, profile, logout, updateProfile } = require('../controllers/userControllers.js'); // Importing controller functions for user registration, login, and current user retrieval
const express = require('express'); // Importing Express.js framework
const router = express.Router(); // Creating a new router instance

// Defining routes and associating them with controller functions
router.post('/register', register); // Route for user registration, handled by the register controller function
router.post('/login', login); // Route for user login, handled by the login controller function
router.delete('/logout', logout); // Route for user login, handled by the login controller function
router.route('/profile')
  .get(validateToken, profile) // Route to retrieve information about the current user, requires token validation before execution, handled by the profile controller function
  .put(validateToken, updateProfile) 

module.exports = router; // Exporting the router for use in other parts of the application