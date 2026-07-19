-- Edis Dashboard - Database Initialisation
-- The Shire's financial ledger and voucher system

CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  completed BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS ledgers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'asset', 'liability')),
  balance DECIMAL(12,2) DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vouchers (
  id SERIAL PRIMARY KEY,
  ledger_id INTEGER REFERENCES ledgers(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('debit', 'credit')),
  date DATE NOT NULL,
  reference TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed data: ledgers of the Shire
INSERT INTO ledgers (name, type, balance, description) VALUES
  ('Main Treasury of Hobbiton', 'asset', 1250.00, 'The general coffers of the Shire, managed by the Thain.'),
  ('Adventuring Fund', 'asset', 875.00, 'Set aside for unexpected journeys, maps, and travel rations.'),
  ('Hospitality Expenses', 'expense', 340.00, 'Second breakfasts, elevenses, luncheon, afternoon tea, dinner, and supper for guests.'),
  ('Pipe-weed & Provisions', 'expense', 180.00, 'Longbottom Leaf, dried goods, and cellar stock.');

INSERT INTO vouchers (ledger_id, description, amount, type, date, reference) VALUES
  (1, 'Quarterly tax from Bywater', 500.00, 'debit', '2026-04-01', 'BW-Q1-2026'),
  (1, 'Repair of the Green Dragon roof', 200.00, 'credit', '2026-04-05', 'GD-ROOF-01'),
  (2, 'Maps of the Lone Lands', 75.00, 'credit', '2026-04-10', 'MAP-LONE-01'),
  (2, 'New walking-staves (set of 4)', 120.00, 'credit', '2026-04-12', 'STAFF-SET-01'),
  (3, 'Gandalf''s birthday feast catering', 150.00, 'credit', '2026-04-15', 'GAND-BDAY-01'),
  (3, 'Tea and cakes for Bilbo''s guests', 45.00, 'credit', '2026-04-18', 'BILBO-TEA-01'),
  (4, 'Longbottom Leaf – autumn harvest', 90.00, 'credit', '2026-04-02', 'LL-HARV-01'),
  (4, 'Dried apples & salted pork', 60.00, 'credit', '2026-04-08', 'PROV-APR-01'),
  (1, 'Mushroom sales from the Marish', 80.00, 'debit', '2026-04-20', 'MUSH-MAR-01'),
  (2, 'Return of unused travel rations', 25.00, 'debit', '2026-04-22', 'RATIONS-RET-01');
