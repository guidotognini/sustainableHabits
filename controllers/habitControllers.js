// Importing necessary modules and models
const asyncHandler = require("express-async-handler"); // Middleware for handling asynchronous errors
const {
  Habit,
  User,
  Milestone,
  Progress,
  Comment,
} = require("../models/models.js"); // Importing models

const getHabits = asyncHandler(async (req, res) => {
  // Check if the user is authenticated
  if (req.authenticated) {
    // If authenticated, retrieve user-specific habits along with progress
    const habitsProgress = await Progress.findAll({
      raw: true,
      where: { user_id: req.userId },
      attributes: ['habit_id', 'completed'],
      include: [{
        model: Milestone,
        raw: true,
        attributes: ['description'],
        required: true
      }]
    });
    
    if(habitsProgress.length === 0) {
      res.status(200).send('You have not adopted any habits yet')
    }
    // Initialize arrays to store unique habit IDs and corresponding habit information
    const habitIds = [];
    const habitsInfo = [];
    
    // Loop through each progress entry to collect unique habit IDs and fetch corresponding habit information
    for (let i = 0; i < habitsProgress.length; i++) {
      let habitId = habitsProgress[i].habit_id;
      if (!habitIds.includes(habitId)) {
        habitIds.push(habitId);
        const habit = await Habit.findByPk(habitId, { raw: true });
        // Calculate progress based on completed milestones
        const milestones = habitsProgress.filter(milestone => milestone.habit_id === habitId);
        const completedMilestones = milestones.filter(milestone => milestone.completed === true);
        const progressPercentage = (completedMilestones.length / milestones.length) * 100;
        // Add progress property to the habit object
        habit.progressPercentage = progressPercentage;
        habitsInfo.push(habit);
      }
    }
    
    // Assign milestones to each habit in the habitsInfo array
    habitsInfo.forEach(habit => {
      habit.Milestones = habitsProgress.filter(milestone => milestone.habit_id === habit.id);
    });
    
    // Send user-specific habits with progress as response
    res.status(200).json(habitsInfo);
  } else {
    // If not authenticated, retrieve all habits
    const habits = await Habit.findAll();
    // Send all habits as response
    res.status(200).json({ "Habits": habits });
  }
});


// Controller function to get a single habit
const getOneHabit = asyncHandler(async (req, res) => {
  // Find habit by ID
  const habit = await Habit.findOne({ where: { id: req.params.id } });
  // Send habit as response
  res.status(200).json(habit);
});

// Controller function to adopt a habit
const adoptHabit = asyncHandler(async (req, res) => {
  const alreadyAdopted = await Progress.findOne({where: {user_id: req.userId, habit_id: Number(req.params.id)}});
  if(alreadyAdopted) {
    res.status(400)
      throw new Error('Habit already adopted. Please choose another one to make the world a even better place')
  }
  // Find user and habit by IDs
  const user = await User.findByPk(req.userId);
  const habit = await Habit.findByPk(Number(req.params.id));
  // Find all milestones associated with the habit
  const milestones = await Milestone.findAll({
    where: { habit_id: Number(req.params.id) },
  });

  // Create progress records for each milestone
  const records = milestones.map((milestone) => ({
    user_id: user.id,
    habit_id: habit.id,
    milestone_id: milestone.id,
    completed: false,
  }));
  await Progress.bulkCreate(records);

  // Generate message with milestones descriptions
  const milestonesDescriptions = milestones.map((e) => `\n- ${e.description}`);

  // Send success message with milestones descriptions as response
  res
    .status(200)
    .send(
      `Congrats! You've just adopted a new habit: ${habit.habit_name}. \n\nNow, let's tackle the milestones to solidify this commitment: ${milestonesDescriptions}`
    );
});

// Controller function to drop a habit
const dropHabit = asyncHandler(async (req, res) => {
  const alreadyAdopted = await Progress.findOne({where: {user_id: req.userId, habit_id: req.params.id}});
  if(!alreadyAdopted) {
    res.status(400)
      throw new Error('Please choose a habit that was already adopted to drop')
  }
  // Delete progress records associated with the habit
  await Progress.destroy({
    where: {
      user_id: req.userId,
      habit_id: Number(req.params.id),
    },
  });
  // Send success message as response
  res.status(200).send("Hope you can readopt this habit soon!");
});

// Controller function to update milestone status
const updateMilestone = asyncHandler(async (req, res) => {
  const alreadyAdopted = await Progress.findOne({where: {user_id: req.userId, habit_id: req.params.id}});
  if(!alreadyAdopted) {
    res.status(400)
      throw new Error('Please choose a habit that was already adopted to update milestones')
  }
  // Find milestone by user ID, habit ID, and milestone ID
  const milestone = await Progress.findOne({
    where: {
      user_id: req.userId,
      habit_id: Number(req.params.id),
      milestone_id: Number(req.params.milestone),
    },
  });
  
  if(!milestone) {
    const possibleMilestones = await Milestone.findAll({
      where: { habit_id: req.params.id }, raw: true, attributes: {exclude: ['habit_id']},
      include: [
        {
          model: Progress,
          where: { user_id: req.userId },
          attributes: ["completed"],
          required: true,
          raw: true
        },
      ],
    });

    const milestoneOptions = possibleMilestones.map(
      (milestone) =>
        `${milestone.id}: ${
          milestone.description
        } - ${milestone['Progresses.completed'] ? 'complete' : 'incomplete'}`
    );

    // Format milestoneOptions as a string with each element on a new line
    const formattedMilestones = milestoneOptions.join('\n');
    return res.status(400).send(`Please specify a milestone ID from the options below in the last URL parameter to update:\n\n${formattedMilestones}`)
  }
  // Toggle milestone completion status
  milestone.completed = !milestone.completed;
  // Save updated milestone status
  await milestone.save({ fields: ["completed"] });
  // Send success message with updated milestone status as response
  res.status(200).send(`Milestone status is now ${milestone.completed}`);
});

// Controller function to get habit progress
const getHabitProgress = asyncHandler(async (req, res) => {
  // Find habit progress by habit ID
  const habitProgress = await Habit.findAll({
    where: { id: Number(req.params.id) },
    attributes: {
      exclude: ["id"],
    },
    include: [
      {
        model: Progress,
        where: { user_id: req.userId },
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

  // Extract progress status for each milestone
  const milestonesStatus = habitProgress[0].Progresses;

  // Calculate progress percentage
  let counter = 0;
  for (let i = 0; i < milestonesStatus.length; i++) {
    if (milestonesStatus[i].completed) counter++;
  }
  let progressPercentage = 0;
  if (counter !== 0) {
    progressPercentage = parseFloat(counter / milestonesStatus.length) * 100;
  }

  // Send habit progress as response
  res
    .status(200)
    .json({
      milestones: milestonesStatus,
      "Habit progress": `${progressPercentage}%`,
    });
});

// Controller function to add a comment to a habit
const commentHabit = asyncHandler(async (req, res) => {
  if(!req.body.comment) {
    res.status(400)
      throw new Error('Provide content in the request body comment property')
  }
  // Create a new comment
  const comment = await Comment.create({
    habit_id: Number(req.params.id),
    user_id: Number(req.userId),
    content: req.body.comment,
  });
  // Send success message with comment content as response
  res
    .status(200)
    .send(`Your comment is online! \n\nComment: \n${comment.content}`);
});

// Controller function to edit a comment
const editComment = asyncHandler(async (req, res) => {
  // Find comment by ID
  const comment = await Comment.findOne({
    where: { id: Number(req.params.commentId), user_id: req.userId },
  });
  if(!comment){
    const habitComments  = await Comment.findAll({where: { habit_id: req.params.id, user_id: req.userId}, raw: true})
    const updateOptions = habitComments.map((comment) => `id: ${comment.id}. Content: ${comment.content}`);
    const formattedComments = updateOptions.join('\n')
    return res.status(400).send(`Please specify a comment ID from the options below in the last URL parameter to update: \n${formattedComments}`)
  }
  // Update comment content
  comment.content = req.body.comment;
  // Save updated comment content
  await comment.save({ fields: ["content"] });
  // Send success message with updated comment content as response
  res.status(200).send(`New content: \n\n${comment.content}`);
});

// Controller function to delete a comment
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findOne({
    where: { id: Number(req.params.commentId), user_id: req.userId },
  });
  if(!comment){
    const habitComments  = await Comment.findAll({where: { habit_id: req.params.id, user_id: req.userId}, raw: true})
    const deleteOptions = habitComments.map((comment) => `id: ${comment.id}. Content: ${comment.content}`);
    const formattedComments = deleteOptions.join('\n')
    return res.status(400).send(`Please specify a comment ID from the options below in the last URL parameter to delete: \n${formattedComments}`)
  }
  // Delete comment by ID
  await Comment.destroy({
    where: { id: Number(req.params.commentId), user_id: req.userId },
  });
  // Send success message as response
  res.status(200).send(`Comment deleted successfully`);
});

// Controller function to retrieve comments for a habit
const showComments = asyncHandler(async (req, res) => {
  // Find all comments for the specified habit ID
  const comments = await Comment.findAll({
    where: { habit_id: Number(req.params.id) },
    order: [["created_at", "DESC"]],
    attributes: ["id", "content", "created_at"],
    include: [{ model: User, attributes: ["username"] }],
  });
  // Send comments as response
  res.status(200).send(comments);
});

// Exporting controller functions for use in other parts of the application
module.exports = {
  getHabits,
  getOneHabit,
  adoptHabit,
  dropHabit,
  getHabitProgress,
  updateMilestone,
  commentHabit,
  editComment,
  deleteComment,
  showComments,
};
