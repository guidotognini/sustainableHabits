const express = require('express');
const router = express.Router();
const {getHabits, getOneHabit, getProgress, adoptHabit} = require('../controllers/habitControllers.js');
const { validateToken } = require('../JWT');

router.route('/')
  .get(getHabits)

router.route('/progress')
  .get(validateToken, getProgress)

router.route('/:id')
  .get(getOneHabit)
  .post(validateToken, adoptHabit)



module.exports = router;