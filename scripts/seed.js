const { access, existsSync } = require('fs');
const { readdir, pathExists } = require('fs-extra');
const { resolve } = require('path');
const db = require('../src/database');
require('../src/models');

const seedFolder = resolve(__dirname, '../seed');

if (require.main === module)
  (async () => {
    try {
      for (const file of await readdir(seedFolder)) {
        const fileTableName = file.split('_').pop();
        const modelName = Object.keys(db.models).find(
          (m) =>
            db.models[m] && `${db.models[m].tableName}.json` === fileTableName
        );
        if (!modelName) continue;
        /**
         * @type {import('sequelize').ModelCtor}
         */
        const model = db.models[modelName];

        const records = require(resolve(seedFolder, file));
        await model.bulkCreate(records);
      }
    } catch (err) {
      console.log(err);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  })();
