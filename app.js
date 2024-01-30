// Importing necessary modules
const express = require("express"); // Importing Express.js framework
const cookieParser = require('cookie-parser'); // Importing cookie-parser middleware
const app = express(); // Creating an Express application instance
require("dotenv").config(); // Loading environment variables from a .env file
const port = process.env.PORT || 3000; // Setting the port for the server to listen on
const errorHandler = require('./middleware/errorHandler.js'); // Importing custom error handling middleware

// Setting up middleware
app.use(express.json()); // Middleware to parse incoming request bodies in JSON format
app.use(cookieParser()); // Middleware to parse cookies from incoming requests

// Setting up routes
app.get('/', (req, res) => res.send('Welcome to a more sustainable lifestyle!'))
app.use('/habits', require('./routes/habitRoutes')); // Mounting habit routes
app.use('/users', require('./routes/userRoutes')); // Mounting user routes

// Error handling middleware
app.use(errorHandler); // Applying custom error handling middleware

// Starting the server
app.listen(port, () => {
  console.log(`Listening on port ${port}`); // Logging a message to indicate that the server is running
});