import { DataTypes } from 'sequelize';
import sequelize from './db.js';
import { hash, compare } from 'bcryptjs';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  skills: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  experience: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  role: {
    type: DataTypes.ENUM('candidate', 'recruiter'),
    defaultValue: 'candidate'
  },
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await hash(user.password, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await hash(user.password, 10);
      }
    }
  }
});

// Instance method to compare passwords
User.prototype.comparePassword = async function (candidatePassword) {
  return await compare(candidatePassword, this.password);
};

export default User;