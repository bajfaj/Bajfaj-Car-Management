import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Get which environment we are in. Defaults to development
const env = process.env.NODE_ENV || 'development';

// 2. Map env to the EXACT 3 DB files we want
const dbMap = {
  development: 'bajfaj_dev.db',
  test: 'bajfaj_test.db',
  production: 'bajfaj_prod.db'
};

const dbFileName = dbMap[env];

if (!dbFileName) {
  throw new Error(`Invalid NODE_ENV: ${env}. Must be one of: development, test, production`);
}

const dbPath = path.join(__dirname, 'data', dbFileName);

// 3. Ensure data folder exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 4. Log which DB we are connecting to
console.log(`[DB] Connecting to: ${dbPath} | Mode: ${env}`);

// 5. Connect to SQLite
const sqlite = sqlite3.verbose();
const db = new sqlite.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to SQLite database');

    // 6. Create table if not exists - FULL 31 COLUMNS
    db.run(`
      CREATE TABLE IF NOT EXISTS cars (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        registration TEXT UNIQUE NOT NULL,
        make TEXT,
        model TEXT,
        colour TEXT,
        engine TEXT,
        engineSize TEXT,
        transmission TEXT,
        fuel TEXT,
        logbook TEXT,
        purchaseYear INTEGER,
        source TEXT,
        winningBid REAL,
        additionalFee REAL,
        delivery REAL,
        repairCost REAL,
        mechanic TEXT,
        personalUse INTEGER,
        mileage TEXT,
        mileagePurchase INTEGER,
        mileageSale INTEGER,
        totalSpent REAL,
        status TEXT DEFAULT 'Held',
        profit REAL,
        saleAmount REAL,
        saleYear INTEGER,
        platformSoldOn TEXT,
        advertisedPlatforms TEXT,
        advertDuration INTEGER,
        deleted INTEGER DEFAULT 0,
        deleted_at TEXT,
        deleted_reason TEXT
      )
    `, (err) => {
      if (err) {
        console.error('[DB] Error creating table:', err.message);
      } else {
        console.log('[DB] Table cars ready with 31 columns');
      }
    });
  }
});

export default db;