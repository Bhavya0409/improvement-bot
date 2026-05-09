import sequelize from '../index.js';
import defineTask from './task.js';
import defineInstance from './instance.js';
import defineTag from './tag.js';
import defineTaskTag from './taskTag.js';

export const Task = defineTask(sequelize);
export const Instance = defineInstance(sequelize);
export const Tag = defineTag(sequelize);
export const TaskTag = defineTaskTag(sequelize);

// Set up associations
Task.hasMany(Instance, { foreignKey: 'task_id', onDelete: 'CASCADE' });
Instance.belongsTo(Task, { foreignKey: 'task_id' });

Task.belongsToMany(Tag, { through: TaskTag, foreignKey: 'task_id' });
Tag.belongsToMany(Task, { through: TaskTag, foreignKey: 'tag_id' });

TaskTag.belongsTo(Task, { foreignKey: 'task_id' });
TaskTag.belongsTo(Tag, { foreignKey: 'tag_id' });
