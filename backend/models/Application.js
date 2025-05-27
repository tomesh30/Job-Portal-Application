import { DataTypes } from 'sequelize';
import sequelize from './db.js';  // Import the default sequelize instance
import User from './Users.js';

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'reviewed', 'accepted', 'rejected'),
    defaultValue: 'pending',
  },
  candidateId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
});

export default Application;
