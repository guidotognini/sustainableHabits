const {
  Habit,
  User,
  Milestone,
  Progress,
  Comment,
} = require("./models/models.js"); // Importing models


const availableOptions = async (habitId, userId, milestone = false) => {
  let options;
  if (milestone) {
    const possibleMilestones = await Milestone.findAll({
      where: { habit_id: habitId },
      raw: true,
      attributes: { exclude: ["habit_id"] },
      include: [
        {
          model: Progress,
          where: { user_id: userId },
          attributes: ["completed"],
          required: true,
          raw: true,
        },
      ],
      order: [['id', 'ASC']]
    });

    options = possibleMilestones.map(
      (milestone) =>
        `${milestone.id}: ${milestone.description} - ${
          milestone["Progresses.completed"] ? "complete" : "incomplete"
        }`
    );
    // Format milestoneOptions as a string with each element on a new line
    const formatted = options.join("\n");
    return formatted;
  } else {
    const habitComments = await Comment.findAll({
      where: { habit_id: habitId, user_id: userId },
      raw: true,
    });
    const commentOptions = habitComments.map(
      (comment) => `id: ${comment.id}. Content: ${comment.content}`
    );
    const formatted = commentOptions.join("\n");
    return formatted;
  }
};

module.exports = {availableOptions}