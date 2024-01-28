const asyncHandler = require('express-async-handler');
const Habit = require("../models/models.js");

const getHabits = asyncHandler(async (req, res) => {
  const habits = await Habit.findAll();
  res.status(200).json(habits);
});

const getOneHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findOne({where: {id: req.params.id}});
  res.status(200).json(habit);
});

const createHabit = asyncHandler(async(req,res) => {
  const habit = await Habit.findOne({where: {id: req.params.id}});
  res.status(200).json(habit);
});

module.exports = {getHabits, getOneHabit, createHabit}