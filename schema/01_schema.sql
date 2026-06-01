-- ============================
-- ENUM DEFINITIONS
-- ============================
CREATE TYPE assembly_type AS ENUM ('IFM', 'PIF', 'IPU');
CREATE TYPE valve_status AS ENUM ('raw', 'installed', 'salvaged', 'mrb');
CREATE TYPE clean_state AS ENUM ('pre_clean', 'post_clean');
CREATE TYPE test_result AS ENUM ('pass', 'fail');

-- ============================
-- WORK ORDERS
-- ============================
CREATE TABLE work_orders (
  work_order_id SERIAL PRIMARY KEY,
  work_order_number VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  closed_at TIMESTAMP
);

-- ============================
-- ASSEMBLIES
-- ============================
CREATE TABLE assemblies (
  assembly_id SERIAL PRIMARY KEY,
  assembly_type assembly_type NOT NULL,
  serial_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(30),
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- ============================
-- VALVES
-- ============================
CREATE TABLE valves (
  valve_id SERIAL PRIMARY KEY,
  serial_number VARCHAR(50) UNIQUE NOT NULL,
  status valve_status DEFAULT 'raw',
  location VARCHAR(100),
  harvested_from_valve_id INT REFERENCES valves(valve_id) ON DELETE SET NULL
);

-- ============================
-- ASSEMBLY ↔ VALVE PARTS
-- ============================
CREATE TABLE assemblies_parts (
  assembly_part_id SERIAL PRIMARY KEY,
  assembly_id INT NOT NULL REFERENCES assemblies(assembly_id) ON DELETE CASCADE,
  valve_id INT NOT NULL REFERENCES valves(valve_id) ON DELETE RESTRICT,
  installed_at TIMESTAMP DEFAULT NOW(),
  removed_at TIMESTAMP,
  work_order_id INT REFERENCES work_orders(work_order_id)
);

-- ============================
-- SUBASSEMBLIES (IFM→PIF, PIF→IPU)
-- ============================
CREATE TABLE assemblies_subassemblies (
  id SERIAL PRIMARY KEY,
  parent_assembly_id INT NOT NULL REFERENCES assemblies(assembly_id) ON DELETE CASCADE,
  child_assembly_id INT NOT NULL REFERENCES assemblies(assembly_id) ON DELETE CASCADE,
  installed_at TIMESTAMP DEFAULT NOW(),
  removed_at TIMESTAMP,
  work_order_id INT REFERENCES work_orders(work_order_id),
  CONSTRAINT uq_parent_child UNIQUE (parent_assembly_id, child_assembly_id)
);

-- ============================
-- KITS
-- ============================
CREATE TABLE kits (
  kit_id SERIAL PRIMARY KEY,
  kit_revision VARCHAR(10),
  clean_state clean_state DEFAULT 'pre_clean',
  delivered_at TIMESTAMP,
  cleaned_at TIMESTAMP
);

-- ============================
-- KIT PARTS
-- ============================
CREATE TABLE kit_parts (
  kit_part_id SERIAL PRIMARY KEY,
  kit_id INT NOT NULL REFERENCES kits(kit_id) ON DELETE CASCADE,
  part_name VARCHAR(100) NOT NULL,
  required_quantity INT NOT NULL,
  actual_quantity INT NOT NULL
);

-- ============================
-- TEST CHAMBERS
-- ============================
CREATE TABLE test_chambers (
  chamber_id SERIAL PRIMARY KEY,
  chamber_type VARCHAR(20) UNIQUE NOT NULL,
  description TEXT
);

-- ============================
-- TEST EVENTS
-- ============================
CREATE TABLE test_events (
  test_event_id SERIAL PRIMARY KEY,
  assembly_id INT NOT NULL REFERENCES assemblies(assembly_id) ON DELETE CASCADE,
  chamber_id INT NOT NULL REFERENCES test_chambers(chamber_id) ON DELETE CASCADE,
  test_timestamp TIMESTAMP DEFAULT NOW(),
  result test_result NOT NULL,
  parameters JSONB,
  retest_number INT DEFAULT 1,
  CONSTRAINT uq_test_once UNIQUE (assembly_id, chamber_id, retest_number)
);

-- ============================
-- MOVEMENTS
-- ============================
CREATE TABLE movements (
  movement_id SERIAL PRIMARY KEY,
  entity_type VARCHAR(20) NOT NULL,
  entity_id INT NOT NULL,
  from_location VARCHAR(100),
  to_location VARCHAR(100),
  timestamp TIMESTAMP DEFAULT NOW(),
  work_order_id INT REFERENCES work_orders(work_order_id)
);

-- ============================
-- INDEXES FOR PERFORMANCE
-- ============================
CREATE INDEX idx_assemblies_serial ON assemblies(serial_number);
CREATE INDEX idx_valves_serial ON valves(serial_number);
CREATE INDEX idx_test_events_assembly ON test_events(assembly_id);
CREATE INDEX idx_test_events_chamber ON test_events(chamber_id);
