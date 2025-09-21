const { Sequelize } = require('sequelize');

// Support either MySQL (if DB_DIALECT=mysql) or a default local SQLite for easy local runs.
const dialect = process.env.DB_DIALECT || 'sqlite';
let sequelize;
if(dialect === 'mysql'){
  sequelize = new Sequelize(process.env.DB_NAME || 'od_system', process.env.DB_USER || 'od_user', process.env.DB_PASS || 'od_pass', {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false
  });
} else {
  const storage = process.env.DB_STORAGE || require('path').join(__dirname, '..', '..', 'db', 'od.sqlite');
  // Pass dialectModule explicitly to avoid dynamic require issues in some environments
  const sqlite3 = require('sqlite3');
  sequelize = new Sequelize({ dialect: 'sqlite', storage, dialectModule: sqlite3, logging: false });
}

module.exports = sequelize;