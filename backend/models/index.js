import sequelize from './db.js';
import User from './Users.js';
import Job from './job.js';
import Application from './Application.js';

// ✅ Define model relationships correctly using the model name
User.hasMany(Job, { foreignKey: 'userId' }); // A user (recruiter) can post many jobs
Job.belongsTo(User, { foreignKey: 'userId' }); // A job belongs to a user

User.hasMany(Application, { foreignKey: 'candidateId' }); // A candidate can apply to many jobs
Application.belongsTo(User, { foreignKey: 'candidateId' });

Job.hasMany(Application, { foreignKey: 'jobId' }); // A job can have many applications
Application.belongsTo(Job, { foreignKey: 'jobId' });

// Export all models and sequelize instance
export default {
  sequelize,
  User,
  Job,
  Application,
};
