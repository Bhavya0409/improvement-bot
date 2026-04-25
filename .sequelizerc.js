const path = require('path');

module.exports = {
  'config': path.resolve('config', 'dbConfig.js'),
  'models-path': path.resolve('models'),
  'migrations-path': path.resolve('migrations'),
  'seeders-path': path.resolve('seeders'),
  'migrations': ['*.cjs'],
};

