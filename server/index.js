const express = require('express');
const cors = require('cors');
require('dotenv').config(); // load.env for local
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

// Helper to map DB row to frontend format
const mapCar = (r) => ({
  id: r.id,
  registration: r.registration,
  brand: r.make,
  model: r.model,
  colour: r.colour,
  engine: r.engine,
  transmission: r.transmission,
  fuel: r.fuel,
  logbook: r.logbook,
  purchaseYear: r.purchase_year,
  source: r.source,
  winningBid: r.winning_bid,
  additionalFee: r.additional_fee,
  delivery: r.delivery,
  repairCost: r.repair_cost,
  mechanic: r.mechanic,
  personalUse: r.personal_use,
  mileagePurchase: r.mileage_purchase,
  totalSpent: r.total_amount_spent,
  status: r.status,
  saleAmount: r.sale_price,
  saleYear: r.sale_year,
  platformSoldOn: r.platform_sold_on,
  advertisedOn: r.advertised_on,
  advertDuration: r.advert_duration,
  mileageSale: r.mileage_sale,
  profit: r.profit_loss,
  deleted_reason: r.deleted_reason,
  deleted_at: r.deleted_at
});

// GET all ACTIVE cars
app.get('/api/cars', async (req, res) => {
  try {
    const rows = await db.query('SELECT * FROM cars WHERE deleted_at IS NULL ORDER BY id DESC', []);
    res.json(rows.map(mapCar));
  } catch (err) {
    console.error("GET /api/cars error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET DELETED cars
app.get('/api/cars/deleted', async (req, res) => {
  try {
    const rows = await db.query('SELECT * FROM cars WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC', []);
    res.json(rows.map(mapCar));
  } catch (err) {
    console.error("GET /api/cars/deleted error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST new car
app.post('/api/cars', async (req, res) => {
  const c = req.body;
  // FIXED: 20 columns = 20?
  const sql = `INSERT INTO cars (registration, make, model, colour, engine, transmission, fuel, logbook, purchase_year, source, winning_bid, additional_fee, delivery, repair_cost, mechanic, personal_use, mileage_purchase, total_amount_spent, status, profit_loss)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  const params = [c.registration, c.brand, c.model, c.colour, c.engine, c.transmission, c.fuel, c.logbook, c.purchaseYear, c.source, c.winningBid, c.additionalFee, c.delivery, c.repairCost, c.mechanic, c.personalUse, c.mileagePurchase, c.totalSpent, c.status, c.profit];
  
  try {
    const result = await db.run(sql, params);
    res.json({ id: result.lastID,...c });
  } catch (err) {
    console.error("POST /api/cars error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// PUT update car
app.put('/api/cars/:id', async (req, res) => {
  const { id } = req.params;
  const c = req.body;
  const sql = `UPDATE cars SET registration=?, make=?, model=?, colour=?, engine=?, transmission=?, fuel=?, logbook=?, purchase_year=?, source=?, winning_bid=?, additional_fee=?, delivery=?, repair_cost=?, mechanic=?, personal_use=?, mileage_purchase=?, total_amount_spent=?, status=?, sale_price=?, sale_year=?, platform_sold_on=?, advertised_on=?, advert_duration=?, mileage_sale=?, profit_loss=? WHERE id=?`;
  const params = [c.registration, c.brand, c.model, c.colour, c.engine, c.transmission, c.fuel, c.logbook, c.purchaseYear, c.source, c.winningBid, c.additionalFee, c.delivery, c.repairCost, c.mechanic, c.personalUse, c.mileagePurchase, c.totalSpent, c.status, c.saleAmount, c.saleYear, c.platformSoldOn, c.advertisedOn, c.advertDuration, c.mileageSale, c.profit, id];
  
  try {
    await db.run(sql, params);
    res.json({ id,...c });
  } catch (err) {
    console.error("PUT /api/cars/:id error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// SOFT DELETE CAR
app.delete('/api/cars/:id', async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  try {
    const carArr = await db.query("SELECT * FROM cars WHERE id =?", [id]);
    const car = carArr[0];
    if (!car) return res.status(404).json({ error: "Car not found" });

    // FIXED: datetime('now') only works in SQLite. NOW() works for MySQL. This works for both via JS
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    await db.run("UPDATE cars SET deleted_at =?, deleted_reason =? WHERE id =?",
      [now, reason || 'Deleted', id]
    );
    
    await db.run("INSERT INTO audit_log (car_id, action, old_data) VALUES (?,?,?)",
      [id, 'SOFT_DELETE', JSON.stringify(car)]
    );
    
    res.json({ success: true, message: "Car deleted" });
  } catch (err) {
    console.error("DELETE error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// RESTORE car
app.put('/api/cars/:id/restore', async (req, res) => {
  const { id } = req.params;
  try {
    await db.run("UPDATE cars SET deleted_at = NULL, deleted_reason = NULL WHERE id =?", [id]);
    res.json({ success: true, message: "Car restored" });
  } catch (err) {
    console.error("RESTORE error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// PERMANENT DELETE car
app.delete('/api/cars/:id/permanent', async (req, res) => {
  const { id } = req.params;
  try {
    await db.run("DELETE FROM cars WHERE id =?", [id]);
    res.json({ success: true, message: "Car permanently deleted" });
  } catch (err) {
    console.error("PERMANENT DELETE error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));