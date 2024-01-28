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


const Habit = sequelize.define('Habit', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  habit_name: {
    type: DataTypes.STRING(40),
    allowNull: false,
    unique: true
  },
  habit_description: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  difficulty_rating: {
    type: DataTypes.DOUBLE,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  impact_rating: {
    type: DataTypes.DOUBLE,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  habit_picture_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
});

const Progress = sequelize.define('Progress', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  habit_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  done: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
});

module.exports = {User, Habit, Progress, sequelize};