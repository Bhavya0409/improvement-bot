import "dotenv/config";
import { Sequelize } from 'sequelize';
import config from './dbConfig.js';

const env = process.env.NODE_ENV || 'development';
const { database, username, password, ...options } = config[env];
const sequelize = new Sequelize(database, username, password, options);

export default sequelize;