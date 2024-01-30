const asyncHandler = require('express-async-handler');
const {Habit, User,  UsersHabits} = require("../models/models.js");

const getHabits = asyncHandler(async (req, res) => {
  const habits = await Habit.findAll();
  res.status(200).send(habits);
});

const getOneHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findOne({where: {id: req.params.id}});
  res.status(200).json(habit);
});

const adoptHabit = async (req, res) => {
  const user = await User.findByPk(req.userId);
  const habit = await Habit.findByPk(Number(req.params.id));
  console.log(`habit: ${habit} and user: ${user}`)
  await user.addHabit(habit, { through: { progress: false }});
  const result = await User.findOne({where: {id: req.userId}, include: Habit});
  const newHabit = result.Habits.filter(e => e.id === Number(req.params.id))[0]
  res.status(200).send(`Congrats! You've just adopted a new habit of ${newHabit.habit_name}`)
  /* const habit_id = req.params.id;
  const user_id = req.userId;
  await UsersHabits.create({user_id, habit_id, progress: false})
  const newHabit = await Habit.findOne({where: {id: habit_id}})
  res.status(200).send(`You've just adopted a new habit of ${newHabit.habit_name}`) */
};

const getProgress = async (req, res) => {
  //retornar informações da tabela hábito junto com a da tabela progress
  const habits = await User.findAll({where: {id: req.userId}, include: Habit});
  res.status(200).json(habits[0].Habits)
};

module.exports = {getHabits, getOneHabit, getProgress, adoptHabit}