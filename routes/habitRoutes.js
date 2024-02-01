const express = require('express');
const router = express.Router();
const {getHabits, getOneHabit, getHabitProgress, adoptHabit} = require('../controllers/habitControllers.js');
const { validateToken } = require('../JWT');

router.route('/')
  .get(getHabits)

router.route('/progress')
  .get(validateToken, getHabits)

router.route('/:id')
  .get(getOneHabit)
  .post(validateToken, adoptHabit)

router.route('/:id/progress')
.get(validateToken, getHabitProgress)

module.exports = router;