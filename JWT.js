// Importing necessary modules
const { sign, verify } = require("jsonwebtoken"); // Importing functions for JWT token signing and verification
const asyncHandler = require("express-async-handler"); // Importing a utility middleware for handling asynchronous errors
require("dotenv").config(); // Loading environment variables from a .env file

// Function to create JWT tokens based on user information
const createTokens = (user) => {
  const accessToken = sign(
    { id: user.id, email: user.email }, // Payload containing user information
    process.env.JWT_SECRET_KEY // Secret key for token signing
  );
  return accessToken; // Returning the generated access token
};

// Middleware function to validate JWT tokens
const validateToken = asyncHandler(async (req, res, next) => {
  const accessToken = req.cookies["access-token"]; // Extracting access token from request cookies
  if (!accessToken) {
    // If access token is not present
    res.status(400);
    throw new Error("User not authenticated");
  } // Return error response
  const validToken = await verify(accessToken, process.env.JWT_SECRET_KEY); // Verifying the access token
  if (validToken) {
    // If token is valid
    const payload = validToken;
    req.userId = payload.id; // Storing user ID extracted from token in request object
    req.authenticated = true; // Flag indicating user is authenticated
    return next(); // Proceed to the next middleware
  }
});

module.exports = { createTokens, validateToken }; // Exporting functions for use in other parts of the application
