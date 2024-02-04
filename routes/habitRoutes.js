const express = require('express');
const router = express.Router();
const { getHabits, getOneHabit, getHabitProgress, adoptHabit, dropHabit, updateMilestone, commentHabit, deleteComment, showComments, editComment } = require('../controllers/habitControllers.js');
const { validateToken } = require('../JWT');

// Route to list all habits
router.get('/', getHabits);

// Route to list progress of habits, requires token validation
router.get('/progress', validateToken, getHabits);

// Routes for specific habit by ID
router.route('/:id')
  .get(getOneHabit)   // Get details of a habit
  .post(validateToken, adoptHabit)   // Adopt a habit, requires token validation
  .delete(validateToken, dropHabit);   // Drop a habit, requires token validation

// Route to get progress of a specific habit by ID, requires token validation
router.get('/:id/progress', validateToken, getHabitProgress);

// Routes for handling comments on a specific habit by ID
router.route('/:id/comment')
  .get(validateToken, showComments)   // Get comments for a habit, requires token validation
  .post(validateToken, commentHabit);   // Comment on a habit, requires token validation

// Routes for handling individual comments on a habit
router.route('/:id/comment/:commentId')
  .put(validateToken, editComment)   // Edit a comment on a habit, requires token validation
  .delete(validateToken, deleteComment);   // Delete a comment on a habit, requires token validation

// Route to update milestone of a habit, requires token validation
router.route('/:id/progress/:milestone')
  .put(validateToken, updateMilestone);

module.exports = router;