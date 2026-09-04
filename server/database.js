import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- STRICT VALIDATION - NO FALLBACK ---
const allowedEnvs = ['development', 'test', 'production'];
const env = process.env.NODE_ENV;

if (!env) {
  throw new Error(`[FATAL] NODE_ENV is not set. Must be: ${allowedEnvs.join(', ')}`);
}
if (!allowedEnvs.includes(env)) {
  throw new Error(`[FATAL] Invalid NODE_ENV '${env}'. Allowed: ${allowedEnvs.join(', ')}`);
}

const envPath = path.join(__dirname, 'env', `.env.${env}`);
if (!fs.existsSync(envPath)) {
  throw new Error(`[FATAL] Env file not found: ${envPath}`);
}
dotenv.config({ path: envPath });

if (!process.env.DATABASE_URL) {
  throw new Error(`[FATAL] DATABASE_URL missing in ${envPath}`);
}

const DB_PATH = process.env.DATABASE_URL;
const dbPath = path.isAbsolute(DB_PATH) ? DB_PATH : path.join(__dirname, DB_PATH);

const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

console.log(`[DB] Strict mode - Connecting to: ${dbPath} | Mode: ${env}`);

const sqlite = sqlite3.verbose();
const db = new sqlite.Database(dbPath, (err) => {
  if (err) {
    console.error('[FATAL] Error opening database', err.message, 'path:', dbPath);
    process.exit(1);
  } else {
    console.log('[DB] Connected to SQLite database');
    
    // FULL 31 COLUMNS - table creation
    db.run(`
      CREATE TABLE IF NOT EXISTS cars (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        registration TEXT,
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
        personalUse TEXT,
        mileage INTEGER,
        mileagePurchase INTEGER,
        mileageSale INTEGER,
        totalSpent REAL,
        status TEXT DEFAULT 'Held',
        profit REAL,
        saleAmount REAL,
        saleYear INTEGER,
        platformSoldOn TEXT,
        advertisedPlatforms TEXT,
        advertDuration TEXT,
        deleted INTEGER DEFAULT 0,
        deleted_at TEXT,
        deleted_reason TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('[FATAL] Error creating table:', err.message);
        process.exit(1);
      } else {
        console.log('[DB] Table cars ready with 31 columns');
      }
    });
  }
});

export default db;