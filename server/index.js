import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: path.join(__dirname, '..', envFile) });

const app = express();
const PORT = process.env.PORT || 3001;
const DB_PATH = process.env.DATABASE_URL || './server/data/bajfaj_dev.db';

app.use(cors());
app.use(express.json());

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.isAbsolute(DB_PATH) ? DB_PATH : path.join(__dirname, '..', DB_PATH);
sqlite3.verbose();
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message, 'path:', dbPath);
  } else {
    console.log(`[${process.env.NODE_ENV}] Connected to SQLite at`, dbPath, `on PORT ${PORT}`);
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
    if (err) console.error('Error creating table:', err.message);
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

app.post('/api/cars', (req, res) => {
  const c = req.body;
  if (c.advertisedOn && !c.advertisedPlatforms) c.advertisedPlatforms = c.advertisedOn;
  delete c.advertisedOn;

  const totalSpent = (Number(c.winningBid)||0)+(Number(c.additionalFee)||0)+(Number(c.delivery)||0)+(Number(c.repairCost)||0);
  const profit = c.status === 'Sold' ? (Number(c.saleAmount)-totalSpent) : -totalSpent;

  const sql = `INSERT INTO cars (registration, make, model, colour, engine, engineSize, transmission, fuel, logbook, purchaseYear, source, winningBid, additionalFee, delivery, repairCost, mechanic, personalUse, mileage, mileagePurchase, mileageSale, totalSpent, status, profit, saleAmount, saleYear, platformSoldOn, advertisedPlatforms, advertDuration) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  const params = [c.registration,c.make,c.model,c.colour,c.engine,c.engineSize||'',c.transmission,c.fuel,c.logbook,c.purchaseYear,c.source,c.winningBid,c.additionalFee,c.delivery,c.repairCost,c.mechanic,c.personalUse,c.mileage||c.mileagePurchase,c.mileagePurchase,c.mileageSale,totalSpent,c.status||'Held',profit,c.saleAmount,c.saleYear,c.platformSoldOn,c.advertisedPlatforms,c.advertDuration];
  db.run(sql, params, function(err){
    if (err) { console.error('SQL ERROR POST:', err.message); return res.status(500).json({error: err.message}); }
    res.json({ id: this.lastID, ...c, totalSpent, profit });
  });
});

app.put('/api/cars/:id', (req, res) => {
  const { id } = req.params;
  const c = { ...req.body };
  if (c.advertisedOn && !c.advertisedPlatforms) c.advertisedPlatforms = c.advertisedOn;
  delete c.advertisedOn;

  const totalSpent = (Number(c.winningBid)||0)+(Number(c.additionalFee)||0)+(Number(c.delivery)||0)+(Number(c.repairCost)||0);
  c.totalSpent = totalSpent;
  c.profit = c.status === 'Sold' ? (Number(c.saleAmount)-totalSpent) : -totalSpent;

  const allowed = ['registration','make','model','colour','engine','engineSize','transmission','fuel','logbook','purchaseYear','source','winningBid','additionalFee','delivery','repairCost','mechanic','personalUse','mileage','mileagePurchase','mileageSale','totalSpent','status','profit','saleAmount','saleYear','platformSoldOn','advertisedPlatforms','advertDuration','deleted','deleted_at','deleted_reason'];
  const keys = Object.keys(c).filter(k => k!=='id' && allowed.includes(k));
  const values = keys.map(k => c[k]);
  const setClause = keys.map(k => `${k} =?`).join(', ');
  if (!keys.length) return res.status(400).json({error:'No valid fields'});

  db.run(`UPDATE cars SET ${setClause} WHERE id =?`, [...values, id], function(err){
    if (err) { console.error('SQL ERROR PUT:', err.message); return res.status(500).json({error: err.message}); }
    res.json({ success: true });
  });
});

app.delete('/api/cars/:id', (req, res) => {
  const { id } = req.params;
  const { reason } = req.body || {};
  db.run('UPDATE cars SET deleted = 1, deleted_at = CURRENT_TIMESTAMP, deleted_reason =? WHERE id =?', [reason||'', id], function(err){
    if (err) return res.status(500).json({error: err.message});
    res.json({ success: true });
  });
});

app.put('/api/cars/:id/restore', (req, res) => {
  db.run('UPDATE cars SET deleted = 0, deleted_at = NULL, deleted_reason = NULL WHERE id =?', [req.params.id], function(err){
    if (err) return res.status(500).json({error: err.message});
    res.json({ success: true });
  });
});

app.delete('/api/cars/:id/permanent', (req, res) => {
  db.run('DELETE FROM cars WHERE id =?', [req.params.id], function(err){
    if (err) return res.status(500).json({error: err.message});
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Server [${process.env.NODE_ENV}] running on http://localhost:${PORT}`);
});