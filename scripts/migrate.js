const db = require('../src/database');
require('../src/models');

if (require.main === module)
  (async () => {
    const database = db.connectionManager.config.database;
    db.connectionManager.config.database = 'mysql';
    await db.query(`CREATE DATABASE IF NOT EXISTS ${database};`);
    await db.query(`USE ${database};`);
    await db.sync({ force: true });

    db.connectionManager.config.database = database;
  })();
