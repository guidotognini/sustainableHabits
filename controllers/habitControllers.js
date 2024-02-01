const asyncHandler = require('express-async-handler');
const {Habit, User, Milestone, Progress, Comment} = require("../models/models.js");

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
    res.status(200).json(userHabits.Habits)
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

const dropHabit = asyncHandler(async (req, res) => {
  await Progress.destroy({
    where: {
      user_id: req.userId,
      habit_id: Number(req.params.id)
    },
  });
  res.status(200).send('Hope you can readopt this habit soon!')
});

const updateMilestone = asyncHandler(async(req, res) => {
  const milestone = await Progress.findOne({where: {
    user_id: req.userId,
    habit_id: Number(req.params.id),
    milestone_id: Number(req.params.milestone)
  }});
  milestone.completed = !milestone.completed
  await milestone.save({fields: ['completed']});
  res.status(200).send(`Milestone status is now ${milestone.completed}`)
});

const getHabitProgress = asyncHandler(async (req, res) => {
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
});

const commentHabit = asyncHandler(async (req, res) => {
  const comment = await Comment.create({habit_id: Number(req.params.id), user_id: Number(req.userId), content: req.body.comment});
  res.status(200).send(`Your comment is online! \n\nComment: \n${comment.content}`)
});

const editComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findOne({where: {
    id: Number(req.params.commentId)  }});
  comment.content = req.body.comment
  await comment.save({fields: ['content']});
  res.status(200).send(`New content: \n\n${comment.content}`)
})

const deleteComment = asyncHandler(async (req, res) => {
  await Comment.destroy({
    where: {
      id: Number(req.params.commentId)
    }
  });
  res.status(200).send(`Comment deleted successfully`)
});

const showComments = asyncHandler(async (req, res) => {
  const comments = await Comment.findAll({where: {habit_id: Number(req.params.id)}, order: [["created_at", "DESC"]], attributes: ['content', 'created_at'],include: [{model: User, attributes: ['username']}]});
  res.status(200).send(comments)
})

module.exports = {getHabits, getOneHabit, adoptHabit, dropHabit, getHabitProgress, updateMilestone, commentHabit, editComment, deleteComment, showComments}