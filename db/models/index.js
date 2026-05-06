import sequelize from '../index.js';
import defineTask from './task.js';
import defineInstance from './instance.js';

export const Task = defineTask(sequelize);
export const Instance = defineInstance(sequelize);

// Set up associations
Task.hasMany(Instance, { foreignKey: 'task_id', onDelete: 'CASCADE' });
Instance.belongsTo(Task, { foreignKey: 'task_id' });
