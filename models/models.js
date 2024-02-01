const {Sequelize, DataTypes} = require('sequelize');

const pgUsername = process.env.PG_USERNAME;
const pgPassword = process.env.PG_PASSWORD;
const dbName = process.env.DB_NAME;

const sequelize = new Sequelize (`postgres://${pgUsername}:${pgPassword}@localhost:5432/${dbName}`);

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: false
});


const Habit = sequelize.define(
  "Habit",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    habit_name: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: true,
    },
    habit_description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    difficulty_rating: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      validate: {
        min: 1,
        max: 5,
      },
    },
    impact_rating: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      validate: {
        min: 1,
        max: 5,
      },
    },
    habit_picture_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "habits",
    timestamps: false,
  }
);

const Milestone = sequelize.define('Milestone', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  habit_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Habit',
      key: 'id'
    }
  },
  description: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'milestones',
  timestamps: false
});

Milestone.belongsTo(Habit, { foreignKey: 'habit_id' }); 
Habit.hasMany(Milestone, { foreignKey: 'habit_id' });

const Progress = sequelize.define('Progress', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  habit_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  milestone_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'progress',
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at',
});

User.belongsToMany(Habit, { through: Progress , foreignKey: 'user_id' });
Habit.belongsToMany(User, { through: Progress , foreignKey: 'habit_id'});
User.hasMany(Progress, {foreignKey: 'user_id'});
Progress.belongsTo(User, {foreignKey: 'user_id'});
Habit.hasMany(Progress, {foreignKey: 'habit_id'});
Progress.belongsTo(Habit, {foreignKey: 'habit_id'});

Habit.hasMany(Milestone, {foreignKey: 'habit_id'});
Milestone.belongsTo(Habit, {foreignKey: 'habit_id'});
Progress.belongsTo(Milestone, { foreignKey: 'milestone_id' });
Milestone.hasMany(Progress, { foreignKey: 'milestone_id' });

const Comment = sequelize.define("Comment", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "users",
      key: "id",
    },
  },
  habit_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "habits",
      key: "id",
    }
  },
  content: {
    type: DataTypes.TEXT
  }
},
{
  tableName: 'comments',
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at' // Automatically adds createdAt and updatedAt columns
});

Habit.hasMany(Comment, {foreignKey: 'habit_id'});
Comment.belongsTo(Habit, {foreignKey: 'habit_id'});
User.hasMany(Comment, {foreignKey: 'user_id'});
Comment.belongsTo(User, {foreignKey: 'user_id'});


module.exports = {User, Habit, Milestone, Progress, Comment, sequelize};