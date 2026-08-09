const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'cars.db'), (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to cars.db');
    
    db.serialize(() => {
      // Create cars table with deleted columns built-in
      // IF NOT EXISTS means it won't overwrite if you already have data
      db.run(`CREATE TABLE IF NOT EXISTS cars (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        registration TEXT,
        make TEXT NOT NULL,
        model TEXT NOT NULL,
        colour TEXT,
        engine TEXT,
        transmission TEXT,
        fuel TEXT,
        logbook TEXT,
        purchase_year INTEGER,
        source TEXT,
        winning_bid REAL,
        additional_fee REAL,
        delivery REAL,
        repair_cost REAL,
        mechanic TEXT,
        personal_use TEXT,
        mileage_purchase INTEGER,
        total_amount_spent REAL,
        status TEXT DEFAULT 'Held',
        sale_price REAL,
        sale_year INTEGER,
        platform_sold_on TEXT,
        advertised_on TEXT,
        advert_duration TEXT,
        mileage_sale INTEGER,
        profit_loss REAL,
        deleted_at TEXT,
        deleted_reason TEXT
      )`);
      
      // Audit log table
      db.run(`CREATE TABLE IF NOT EXISTS audit_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        car_id INTEGER,
        action TEXT,
        old_data TEXT,
        new_data TEXT,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP
      )`);
      
      console.log('Tables are ready');
    });
  }
});

module.exports = db;