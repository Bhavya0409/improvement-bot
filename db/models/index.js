import sequelize from '../index.js';
import defineImprovement from './improvement.js';

export const Improvement = defineImprovement(sequelize);