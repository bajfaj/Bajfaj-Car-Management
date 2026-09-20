import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- STRICT VALIDATION ---
const allowedEnvs = ['development', 'test', 'production'];
const env = process.env.NODE_ENV;

if (!env) {
  throw new Error(`[FATAL] NODE_ENV is not set. Use: development | test | production`);
}
if (!allowedEnvs.includes(env)) {
  throw new Error(`[FATAL] Invalid NODE_ENV '${env}'. Must be one of: ${allowedEnvs.join(', ')}`);
}

const envPath = path.join(__dirname, 'env', `.env.${env}`);

if (!fs.existsSync(envPath)) {
  throw new Error(`[FATAL] Env file not found: ${envPath}`);
}

dotenv.config({ path: envPath });
console.log(`[ENV] Loaded ${envPath}`);

if (!process.env.PORT) {
  throw new Error(`[FATAL] PORT missing in ${envPath}`);
}
if (!process.env.DATABASE_URL) {
  throw new Error(`[FATAL] DATABASE_URL missing in ${envPath}`);
}

const app = express();
const PORT = process.env.PORT;
const DB_PATH = process.env.DATABASE_URL;

app.use(cors());
app.use(express.json());

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.isAbsolute(DB_PATH)? DB_PATH : path.join(__dirname, DB_PATH);

sqlite3.verbose();
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('[FATAL] Error opening database:', err.message, 'path:', dbPath);
    process.exit(1);
  } else {
    console.log(`[${env}] Connected to SQLite at`, dbPath, `on PORT ${PORT}`);
    initDb();
  }
});

function initDb() {
  db.run(`CREATE TABLE IF NOT EXISTS cars (
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
  )`, (err) => {
    if (err) {
      console.error('[FATAL] Error creating table:', err.message);
      process.exit(1);
    }
    else console.log('Cars table now ready');
  });
}

app.get('/api/cars', (req, res) => {
  db.all('SELECT * FROM cars WHERE deleted = 0 OR deleted IS NULL ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/cars/deleted', (req, res) => {
  db.all('SELECT * FROM cars WHERE deleted = 1 ORDER BY deleted_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// --- VALIDATION BLOCK - FIXED FOR VAL-01 to VAL-14 ---
const ALLOWED_FUEL = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'LPG', 'CNG'];
const ALLOWED_STATUS = ['Available', 'Held', 'Sold', 'Reserved'];
const ALLOWED_TRANSMISSION = ['Manual', 'Automatic', 'Semi-Auto'];

function validateCarPayload(c, isUpdate = false, existing = null) {
  const errors = [];
  const currentYear = new Date().getFullYear();
  const merged = existing? {...existing,...c } : c;

  if (!isUpdate || c.registration!== undefined) {
    if (!c.registration || typeof c.registration!== 'string' || c.registration.trim() === '') {
      errors.push('registration is required and must be non-empty');
    } else if (c.registration.trim().length > 8) {
      errors.push('registration format invalid: max 8 chars');
    }
  }

  if (!isUpdate || c.make!== undefined) {
    if (!c.make || c.make.trim() === '') errors.push('make is required');
  }
  if (!isUpdate || c.model!== undefined) {
    if (!c.model || String(c.model).trim() === '') errors.push('model is required');
  }

  ['winningBid', 'additionalFee', 'delivery', 'repairCost', 'saleAmount', 'mileage', 'mileagePurchase', 'mileageSale'].forEach(field => {
    if (c[field]!== undefined && c[field]!== '' && c[field]!== null) {
      const num = Number(c[field]);
      if (isNaN(num) || num < 0) {
        errors.push(`${field} must be a number >= 0`);
      }
    }
  });

  if (c.purchaseYear!== undefined && c.purchaseYear!== '' && c.purchaseYear!== null) {
    const y = Number(c.purchaseYear);
    if (isNaN(y) || y < 1900 || y > currentYear + 1) {
      errors.push(`purchaseYear must be between 1900 and ${currentYear + 1}`);
    }
  }

  if (c.fuel!== undefined && c.fuel!== '' && c.fuel!== null) {
    if (!ALLOWED_FUEL.includes(c.fuel)) {
      errors.push(`fuel must be one of: ${ALLOWED_FUEL.join(', ')}`);
    }
  }

  if (c.transmission!== undefined && c.transmission!== '' && c.transmission!== null) {
    if (!ALLOWED_TRANSMISSION.includes(c.transmission)) {
      errors.push(`transmission must be one of: ${ALLOWED_TRANSMISSION.join(', ')}`);
    }
  }

  if (c.status!== undefined && c.status!== '' && c.status!== null) {
    if (!ALLOWED_STATUS.includes(c.status)) {
      errors.push(`status must be one of: ${ALLOWED_STATUS.join(', ')}`);
    }
  }

  // VAL-09,10,11,12 - only check when final status is Sold
  if (merged.status === 'Sold') {
    if (merged.saleAmount === undefined || merged.saleAmount === '' || merged.saleAmount === null || Number(merged.saleAmount) <= 0) {
      errors.push('saleAmount is required when status is Sold');
    }
    if (!merged.platformSoldOn || String(merged.platformSoldOn).trim() === '') {
      errors.push('platformSoldOn is required when status is Sold');
    }
    if (!merged.advertisedPlatforms || String(merged.advertisedPlatforms).trim() === '') {
      errors.push('advertisedPlatforms is required when status is Sold');
    }
    if (merged.saleYear!== undefined && merged.purchaseYear!== undefined) {
      if (Number(merged.saleYear) < Number(merged.purchaseYear)) {
        errors.push('saleYear cannot be less than purchaseYear');
      }
    }
  }

  return errors;
}

app.post('/api/cars', (req, res) => {
  const c = req.body;
  const errors = validateCarPayload(c, false, null);
  if (errors.length) {
    return res.status(400).json({ errors });
  }
  if (c.advertisedOn &&!c.advertisedPlatforms) c.advertisedPlatforms = c.advertisedOn;
  delete c.advertisedOn;
  const totalSpent = (Number(c.winningBid) || 0) + (Number(c.additionalFee) || 0) + (Number(c.delivery) || 0) + (Number(c.repairCost) || 0);
  const profit = c.status === 'Sold'? (Number(c.saleAmount) - totalSpent) : -totalSpent;
  const sql = `INSERT INTO cars (registration, make, model, colour, engine, engineSize, transmission, fuel, logbook, purchaseYear, source, winningBid, additionalFee, delivery, repairCost, mechanic, personalUse, mileage, mileagePurchase, mileageSale, totalSpent, status, profit, saleAmount, saleYear, platformSoldOn, advertisedPlatforms, advertDuration) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  const params = [c.registration, c.make, c.model, c.colour, c.engine, c.engineSize || '', c.transmission, c.fuel, c.logbook, c.purchaseYear, c.source, c.winningBid, c.additionalFee, c.delivery, c.repairCost, c.mechanic, c.personalUse, c.mileage || c.mileagePurchase, c.mileagePurchase, c.mileageSale, totalSpent, c.status || 'Available', profit, c.saleAmount, c.saleYear, c.platformSoldOn, c.advertisedPlatforms, c.advertDuration];
  db.run(sql, params, function (err) {
    if (err) { console.error('SQL ERROR POST:', err.message); return res.status(500).json({ error: err.message }); }
    res.status(201).json({ id: this.lastID,...c, totalSpent, profit });
  });
});

app.put('/api/cars/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM cars WHERE id =?', [id], (err, existing) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!existing) return res.status(404).json({ error: 'Car not found' });

    // VALIDATE AFTER MERGE - this fixes VAL-09 to VAL-12
    const errors = validateCarPayload(req.body, true, existing);
    if (errors.length) {
      return res.status(400).json({ errors });
    }

    const body = {...req.body };
    if (body.advertisedOn &&!body.advertisedPlatforms) body.advertisedPlatforms = body.advertisedOn;
    delete body.advertisedOn;

    const c = {...existing,...body };
    const totalSpent = (Number(c.winningBid) || 0) + (Number(c.additionalFee) || 0) + (Number(c.delivery) || 0) + (Number(c.repairCost) || 0);
    c.totalSpent = totalSpent;
    c.profit = c.status === 'Sold'? (Number(c.saleAmount) || 0) - totalSpent : -totalSpent;

    const allowed = ['registration', 'make', 'model', 'colour', 'engine', 'engineSize', 'transmission', 'fuel', 'logbook', 'purchaseYear', 'source', 'winningBid', 'additionalFee', 'delivery', 'repairCost', 'mechanic', 'personalUse', 'mileage', 'mileagePurchase', 'mileageSale', 'totalSpent', 'status', 'profit', 'saleAmount', 'saleYear', 'platformSoldOn', 'advertisedPlatforms', 'advertDuration', 'deleted', 'deleted_at', 'deleted_reason'];
    const keysToUpdate = new Set([...Object.keys(body), 'totalSpent', 'profit']);
    const keys = [...keysToUpdate].filter(k => k!== 'id' && allowed.includes(k));
    const values = keys.map(k => c[k]);
    const setClause = keys.map(k => `${k} =?`).join(', ');
    if (!keys.length) return res.status(400).json({ error: 'No valid fields' });

    db.run(`UPDATE cars SET ${setClause} WHERE id =?`, [...values, id], function (err) {
      if (err) { console.error('SQL ERROR PUT:', err.message); return res.status(500).json({ error: err.message }); }
      res.json({ success: true });
    });
  });
});

app.delete('/api/cars/:id', (req, res) => {
  const { id } = req.params;
  const { reason } = req.body || {};
  db.run('UPDATE cars SET deleted = 1, deleted_at = CURRENT_TIMESTAMP, deleted_reason =? WHERE id =?', [reason || '', id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.put('/api/cars/:id/restore', (req, res) => {
  db.run('UPDATE cars SET deleted = 0, deleted_at = NULL, deleted_reason = NULL WHERE id =?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.delete('/api/cars/:id/permanent', (req, res) => {
  db.run('DELETE FROM cars WHERE id =?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Server [${env}] running on http://localhost:${PORT}`);
});