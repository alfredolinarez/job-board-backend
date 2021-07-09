const database = require('../database');

const models = [
  require('./Category'),
  require('./Config'),
  require('./Job'),
  require('./Role'),
  require('./Session'),
  require('./User'),
];

module.exports = models.reduce((acc, model) => {
  /** @type {import('sequelize').Model} */
  const loadedModel = model.model(database);
  acc[loadedModel.name] = loadedModel.name;
  return acc;
}, {});

models.forEach((val) => {
  if (val.relationships) {
    val.relationships(database.models);
  }
});
