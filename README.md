# Bajfaj Car Management Application

## Project Overview
Full-stack web application to manage car inventory, replacing manual spreadsheet workflows. Tracks vehicle purchases, repairs, sales, and auto-calculates financial metrics including total spend and profit/loss. Built post-redundancy to enhance modern QA engineering, React development, and product delivery skills.

**Status:** M1 + M2 + M3 Complete | M4 - M5 In Pipeline 
**Live Demo:** TBD  

## Business Problem
Manual Excel tracking of car inventory became error-prone and time-consuming with:
- No auto-calculation of `total_amount_spent` across purchase + multiple repairs
- Profit/loss required manual formulas, easy to break when adding rows
- No mobile-friendly way to update data while viewing cars
- Difficult to query historical data: "Show all diesel cars sold in 2018 with >£300 repairs"
- No backup/version control — risk of data loss

This app solves all of the above with a single-page React app + SQLite backend.

## Features
**M1: MVP Data + CRUD**
- View all cars in sortable table with status badges: For Sale, Sold, Reserved
- Dashboard KPIs: Total Cars, Cars Sold, Net Profit
- SQLite persistence with 3 seeded test vehicles

**M2: Add/Edit + Financials** 
- Add Car modal with validation: make, model, purchase price/date, fuel type
- Edit Car modal with multi-repair section: add/remove repairs dynamically 
- Auto-calculating fields: `total_amount_spent` and `profit_loss` computed on save
- Mobile-responsive modals with pinned Save/Cancel buttons and scrollable content
- Form validation: required fields, date logic, positive numbers

**M3: Dashboard + Reports**
- 3-page structure: Dashboard, Cars, Reports/Analytics
- Cars page with tabs: All, Held, Sold, Deleted + soft delete + restore
- Reports page with Year/Brand filters + KPI cards + summary table
- Responsive sidebar + header layout

**M4: Polish + Backup** `Planned`
- Export/Import JSON for backup and migration
- CSV bulk import for historical data
- Dark mode toggle
- Chart visualizations for profit trends

**M5: Playwright Automation** `Planned`
- Full E2E regression suite covering CRUD + financial logic
- CI integration via GitHub Actions

## Technology Stack
**Frontend:** React 18, Vite, Tailwind CSS, TypeScript  
**Backend:** Node.js, Express, SQLite3  
**Tooling:** ESLint, Prettier, Git  
**Testing:** Playwright, Playwright Test, GitHub Actions   
**DevOps:** GitHub, npm scripts

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
- **Data Layer**: SQLite with tables `cars`, `repairs`. Foreign key relationship on `car_id`  
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
Quality is built in through multiple layers, not just end-of-dev testing:

**1. Functional Testing**  
Verify each feature works to spec. Test happy paths + edge cases for Add/Edit/Delete flows, form validation, and modal behavior. Done manually during M1/M2, will be automated in M5.

**2. Exploratory Testing**  
Session-based testing to find issues specs miss. Focus areas: mobile UX, rapid add/edit/delete sequences, large datasets, browser back/forward behavior. Done ad-hoc after each milestone.

**3. Regression Testing**  
Ensure new changes don't break existing features. Currently manual smoke test of M1+M2 after each commit. Will be replaced by Playwright suite in M5 running on every PR.

**4. UI Automation** 
Playwright E2E suite covering critical user journeys: add car → add repairs → sell → verify profit. Runs in CI to catch regressions before merge.

**5. Business Rule Validation**  
Dedicated tests for auto-calc logic. Examples: car with 0 repairs, car with 5 repairs, unsold car shows no profit, editing purchase price updates totals. Covered by Playwright `auto-calc.spec.ts` in M5.

**6. Data Validation**  
API-level checks + DB constraints. Test invalid payloads: missing required fields, string in price field, SQL injection attempts, duplicate IDs. Foreign key constraints prevent orphaned repairs.

**7. Cross-browser Testing**  
Playwright projects for Chromium, Firefox, WebKit. Mobile Chrome + Mobile Safari viewports to catch layout/scroll bugs like the modal issue we fixed in M2.

## Automation Framework `M5`
**Tool:** Playwright + TypeScript  
**Pattern:** Page Object Model for maintainability  
**Structure:**
```
/tests
  /pages       - CarTablePage.ts, AddCarPage.ts
  /specs       - add-car.spec.ts, profit-loss.spec.ts
  /fixtures    - seed.db, test-data.ts
playwright.config.ts
```

**CI:** GitHub Actions workflow runs full suite on push. HTML report + trace uploaded as artifacts.  
**Coverage Goal:** 80% of user journeys, 100% of financial calc logic.

## Lessons Learned
1. **Mobile-first modals are hard** — Pinned buttons + scrollable content required `flex` + `overflow-y-auto` + careful `max-h-[90vh]` tuning
2. **SQLite is perfect for MVPs** — Zero config, file-based, but need migration strategy before multi-user
3. **Auto-calc must be server-side** — Client calc can be bypassed. Single source of truth prevents data drift
4. **Playwright over Cypress for this stack** — Better TypeScript support, native multi-tab, faster CI runs
5. **Ship M1+M2 before optimizing** — Having a working app to use daily reveals what filters/KPIs you actually need for M3

---
**Author:** bajfaj  
**GitHub:** github.com/bajfaj/Bajfaj-Car-Management  
**Last Updated:** August 2026