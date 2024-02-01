const asyncHandler = require('express-async-handler');
const {Habit, User, Milestone, Progress} = require("../models/models.js");

const getHabits = asyncHandler(async (req, res) => {
  if(req.authenticated) {
    const userHabits = await User.findByPk(req.userId, {
      include: [
        {
          model: Habit,
          include: [Milestone],
        },
      ],
    });
    res.status(200).json(userHabits)
  } else {
    const habits = await Habit.findAll();
    res.status(200).send(habits);
  }
  
});

const getOneHabit = asyncHandler(async (req, res) => {
  console.log(req.userId)
  const habit = await Habit.findOne({where: {id: req.params.id}});
  res.status(200).json(habit);
});

const adoptHabit = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.userId);
  const habit = await Habit.findByPk(Number(req.params.id));
  const milestones = await Milestone.findAll({
    where: { habit_id: Number(req.params.id) },
  });

  const records = milestones.map((milestone) => ({
    user_id: user.id,
    habit_id: habit.id,
    milestone_id: milestone.id,
    completed: false,
  }));

  await Progress.bulkCreate(records);

  const milestonesDescriptions = milestones.map(
    (e) => `\n- ${e.description}`);

  res
    .status(200)
    .send(
      `Congrats! You've just adopted a new habit: ${
        habit.habit_name
      }. \n\nNow, let's tackle the milestones to solidify this commitment: ${milestonesDescriptions
      }`
    );
});

const getHabitProgress = async (req, res) => {
  const habitProgress = await Habit.findAll({
    where: { id: Number(req.params.id) },
    attributes: {
      exclude: ["id"],
    },
    include: [
      {
        model: Progress,
        attributes: ["completed"],
        include: [
          {
            model: Milestone,
            attributes: ["description"],
          },
        ],
      },
    ],
  });

  const milestonesStatus = habitProgress[0].Progresses;

  let counter = 0;
  for (let i = 0; i < milestonesStatus.length; i++) {
    if(milestonesStatus[i].completed)
      counter++
  }

  let progressPercentage = 0
  if (counter !== 0) {progressPercentage = parseFloat(counter/milestonesStatus.length)*100}
  console.log(`Habit progress: ${progressPercentage}%`);
  res.status(200).send(milestonesStatus);
};

module.exports = {getHabits, getOneHabit, adoptHabit, getHabitProgress}