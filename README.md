# Bajfaj Car Management Application

## Project Overview
Full-stack web application to manage car inventory, replacing manual spreadsheet workflows. Tracks vehicle purchases, repairs, sales, and auto-calculates financial metrics including total spend and profit/loss. Built post-redundancy to enhance modern QA engineering, React development, and product delivery skills.

**Status:** M1 + M2 + M3 Complete | M4 Polished Planned | M5 WIP | M6 Planned 
**Live Demo:** TBD  

**Related Repo:** Automated API Tests: [bajfaj/Bajfaj-Car-Tests](https://github.com/bajfaj/Bajfaj-Car-Tests) - 8/8 Playwright Tests Passing + Bug Found & Fixed

## Business Problem
Manual Excel tracking of car inventory became error-prone and time-consuming with:
- No auto-calculation of `total_amount_spent` across purchase + multiple repairs
- Profit/loss required manual formulas, easy to break when adding rows
- No mobile-friendly way to updates on the forecourt
- Difficult to query historical data: "Show all diesel cars sold in 2018 with >£300 repairs"
- No backup/version control — risk of data loss

This app solves all of the above with a React SPA + SQLite backend + auto-calc server-side.

## Features
**M1: MVP Data + CRUD - Complete**
- View all cars in sortable table with status badges: For Sale, Sold, Reserved
- Dashboard KPIs: Total Cars, Cars Sold, Net Profit
- SQLite persistence with seeded test vehicles

**M2: Add/Edit + Financials - Complete** 
- Add Car modal with validation: make, model, purchase price/date, fuel type
- Edit Car with repairs section (current implementation: JSON field, evolving to relational)
- Auto-calculating fields: `total_amount_spent` and `profit_loss` computed server-side
- Mobile-responsive modals with pinned Save/Cancel + scrollable content

**M3: Dashboard + Reports - Complete**
- 3-page structure: Dashboard, Cars, Reports/Analytics
- Cars page with tabs: All, Held, Sold, Deleted + soft delete + restore
- Reports page with Year/Brand filters + KPI cards + summary table
- Responsive sidebar + header layout

**M4: Polish + Backup** `Planned`
- Export/Import JSON for backup and migration
- CSV bulk import for historical data
- Dark mode toggle + Chart visualizations

**M5: Playwright Automation** `WIP (In Progress)`
- ✅ API Tests: 8/8 passing - lifecycle CRUD + business logic assertions - [See Repo](https://github.com/bajfaj/Bajfaj-Car-Tests)
- ✅ Bug Found: PATCH profit recalculation - caught by automation, fixed in this repo
- 🔄 UI Tests: Next - Page Object Model for Add/Edit/Sell flows
- CI: GitHub Actions planned

**M6: Repairs Management - Planned (New)**
- New dedicated Repairs page to replace simple JSON field
- Entities: Part Vendor, Repairer (garage/mechanic), Car Issue / Repair Job
- Link repairs to cars with cost, date, invoice upload
- Reporting: Cost by vendor/repairer

## Technology Stack
**Frontend:** React 18, Vite, Tailwind CSS, TypeScript  
**Backend:** Node.js, Express, SQLite3  
**Tooling:** ESLint, Prettier, Git  
**Testing:** Playwright (API + UI), GitHub Actions   
**DevOps:** GitHub

## Architecture
```
Client (React + Vite) 
    ↓ REST API 
Express Server 
    ↓ SQL Queries
SQLite DB (cars.db)
```

- **Frontend**: SPA with component structure: `CarTable`, `AddCarModal`, `EditCarModal`, `Dashboard`  
- **API Layer**: Express routes `/api/cars` for GET, POST, PUT, DELETE  
- **Data Layer**: SQLite with `cars` table (repairs currently stored as field, M6 will normalize) 
- **Business Logic**: Auto-calc runs server-side before save to prevent client tampering

## Business Rules
1. `total_amount_spent` = `purchase_price` + SUM(`repairs.cost`) — recalculated on every save
2. `profit_loss` = `sale_price` - `total_amount_spent` — only calculated if `status = 'Sold'` and `sale_price` exists
3. Car cannot be marked `Sold` without `sale_date` and `sale_price`
4. Repair costs must be ≥ 0. Negative values rejected
5. `purchase_date` cannot be in the future
6. Deleting a car cascades to delete all related repairs

## Future Enhancements
*TBD — add as needed*  
Ideas: Photo uploads per car, PDF invoice generation, integration with AutoTrader API, multi-user auth, PWA offline mode

## Testing Strategy
Quality is built in, not bolted on.

**1. API Automation (M5 WIP)**
Dedicated repo: [Bajfaj-Car-Tests](https://github.com/bajfaj/Bajfaj-Car-Tests)
Playwright `APIRequestContext`, isolated fixtures, auto-cleanup, profit assertions. 8/8 passing.

**2. UI Automation (M5 Next)**
Playwright E2E: add car -> add repairs -> sell -> verify profit. Page Object Model.

**3. Exploratory & Regression**
Session-based mobile UX testing, rapid add/edit/delete sequences. Manual smoke after each commit until CI is live.

**4. Data Validation**
API-level checks + DB constraints. Invalid payloads, negative prices, SQL injection checks.

**5. Cross-browser Testing**  
Playwright projects for Chromium, Firefox, WebKit. Mobile Chrome + Mobile Safari viewports to catch layout/scroll bugs spotted in M2.


## Lessons Learned
1. **Mobile-first modals are hard** — Pinned buttons + scrollable content required `flex` + `overflow-y-auto` + careful `max-h-[90vh]` tuning
2. **SQLite is perfect for MVPs** — Zero config, file-based, but need migration strategy before multi-user
3. **Auto-calc must be server-side** — Client calc can be bypassed. Single source of truth prevents data drift
4. **Playwright over Cypress for this stack** — Better TypeScript support, native multi-tab, faster CI runs
5. **Ship M1+M2 before optimizing** — Having a working app to use daily reveals real filters/KPIs actually need for M3

---
**Author:** bajfaj  
**GitHub:** github.com/bajfaj/Bajfaj-Car-Management  
**Last Updated:** September 2026