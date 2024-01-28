const express = require('express');
const router = express.Router();
const {getHabits, getOneHabit, createHabit} = require('../controllers/habitControllers.js');
const { validateToken } = require('../JWT');

router.use(validateToken);

router.route('/')
  .get(getHabits)
  .post(createHabit)

router.route('/:id')
  .get(getOneHabit)

module.exports = router;