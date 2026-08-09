const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

// GET all ACTIVE cars
app.get('/api/cars', (req, res) => {
  db.all('SELECT * FROM cars WHERE deleted_at IS NULL ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      console.error("GET /api/cars error:", err.message);
      return res.status(500).json({ error: err.message });
    }
    // Map DB columns back to frontend format
    const cars = rows.map(r => ({
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
    }))
    res.json(cars);
  });
});

// GET DELETED cars
app.get('/api/cars/deleted', (req, res) => {
  db.all('SELECT * FROM cars WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC', [], (err, rows) => {
    if (err) {
      console.error("GET /api/cars/deleted error:", err.message);
      return res.status(500).json({ error: err.message });
    }
    const cars = rows.map(r => ({
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
    }))
    res.json(cars);
  });
});

// POST new car - FIXED: 20 columns = 20?
app.post('/api/cars', (req, res) => {
  const c = req.body;
  const sql = `INSERT INTO cars (registration, make, model, colour, engine, transmission, fuel, logbook, purchase_year, source, winning_bid, additional_fee, delivery, repair_cost, mechanic, personal_use, mileage_purchase, total_amount_spent, status, profit_loss)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  const params = [c.registration, c.brand, c.model, c.colour, c.engine, c.transmission, c.fuel, c.logbook, c.purchaseYear, c.source, c.winningBid, c.additionalFee, c.delivery, c.repairCost, c.mechanic, c.personalUse, c.mileagePurchase, c.totalSpent, c.status, c.profit];
  db.run(sql, params, function(err) {
    if (err) {
      console.error("POST /api/cars error:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID,...c });
  });
});

// PUT update car
app.put('/api/cars/:id', (req, res) => {
  const { id } = req.params;
  const c = req.body;
  const sql = `UPDATE cars SET registration=?, make=?, model=?, colour=?, engine=?, transmission=?, fuel=?, logbook=?, purchase_year=?, source=?, winning_bid=?, additional_fee=?, delivery=?, repair_cost=?, mechanic=?, personal_use=?, mileage_purchase=?, total_amount_spent=?, status=?, sale_price=?, sale_year=?, platform_sold_on=?, advertised_on=?, advert_duration=?, mileage_sale=?, profit_loss=? WHERE id=?`;
  const params = [c.registration, c.brand, c.model, c.colour, c.engine, c.transmission, c.fuel, c.logbook, c.purchaseYear, c.source, c.winningBid, c.additionalFee, c.delivery, c.repairCost, c.mechanic, c.personalUse, c.mileagePurchase, c.totalSpent, c.status, c.saleAmount, c.saleYear, c.platformSoldOn, c.advertisedOn, c.advertDuration, c.mileageSale, c.profit, id];
  db.run(sql, params, function(err) {
    if (err) {
      console.error("PUT /api/cars/:id error:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ id,...c });
  });
});

// SOFT DELETE CAR
app.delete('/api/cars/:id', (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  db.get("SELECT * FROM cars WHERE id =?", [id], (err, car) => {
    if (err) {
      console.error("DELETE get car error:", err.message);
      return res.status(500).json({ error: err.message });
    }
    if (!car) return res.status(404).json({ error: "Car not found" });

    db.run("UPDATE cars SET deleted_at = datetime('now'), deleted_reason =? WHERE id =?",
      [reason || 'Deleted', id],
      function(err) {
        if (err) {
          console.error("DELETE update error:", err.message);
          return res.status(500).json({ error: err.message });
        }
        db.run("INSERT INTO audit_log (car_id, action, old_data) VALUES (?,?,?)",
          [id, 'SOFT_DELETE', JSON.stringify(car)],
          (err) => {
            if (err) console.error("Audit log error:", err);
            res.json({ success: true, message: "Car deleted" });
          }
        );
      }
    );
  });
});

// RESTORE car
app.put('/api/cars/:id/restore', (req, res) => {
  const { id } = req.params;
  db.run("UPDATE cars SET deleted_at = NULL, deleted_reason = NULL WHERE id =?", [id], function(err) {
    if (err) {
      console.error("RESTORE error:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, message: "Car restored" });
  });
});

// PERMANENT DELETE car
app.delete('/api/cars/:id/permanent', (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM cars WHERE id =?", [id], function(err) {
    if (err) {
      console.error("PERMANENT DELETE error:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, message: "Car permanently deleted" });
  });
});

app.listen(3001, () => console.log('Server running on http://localhost:3001'));