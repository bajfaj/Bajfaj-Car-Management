const path = require('path');
require('dotenv').config();

let db;

if (process.env.DB_HOST) {
  // RAILWAY = MySQL
  const mysql = require('mysql2/promise');
  const pool = mysql.createPool({
    host: process.env.DB_HOST, user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, database: process.env.DB_NAME,
    waitForConnections: true, connectionLimit: 10,
  });
  
  db = {
    query: async (sql, params) => {
      const [rows] = await pool.query(sql, params);
      return rows;
    },
    run: async (sql, params) => { // for INSERT/UPDATE/DELETE
      const [result] = await pool.query(sql, params);
      return { lastID: result.insertId, changes: result.affectedRows };
    }
  };
  console.log("Connected to MySQL");
  // run createTablesMySQL here...

} else {
  // LOCAL = SQLite
  const sqlite3 = require('sqlite3').verbose();
  const sqliteDb = new sqlite3.Database(path.join(__dirname, 'cars.db'));
  
  db = {
    query: (sql, params) => { // for SELECT
      return new Promise((resolve, reject) => {
        sqliteDb.all(sql, params, (err, rows) => err? reject(err) : resolve(rows));
      });
    },
    run: (sql, params) => { // for INSERT/UPDATE/DELETE
      return new Promise((resolve, reject) => {
        sqliteDb.run(sql, params, function(err) {
          err? reject(err) : resolve({ lastID: this.lastID, changes: this.changes });
        });
      });
    }
  };
  console.log("Connected to SQLite");
  // run createTablesSQLite here...
}

module.exports = db;