-- ============================================
-- WORK ORDERS
-- ============================================
INSERT INTO work_orders (work_order_number, description)
VALUES
('WO-1001', 'Build IFM-001'),
('WO-1002', 'Build IFM-002'),
('WO-1003', 'Build IFM-003'),
('WO-1004', 'Build IFM-004'),
('WO-1005', 'Build IFM-005'),
('WO-1006', 'Build IFM-006'),
('WO-2001', 'Build PIF-01'),
('WO-2002', 'Build PIF-02'),
('WO-2003', 'Build PIF-03'),
('WO-3001', 'Build IPU-01'),
('WO-3002', 'Build IPU-02'),
('WO-4001', 'Salvage operations'),
('WO-5001', 'Rework after MQC failure'),
('WO-5002', 'Rework after ISTC failure')
ON CONFLICT (work_order_number) DO NOTHING;

-- ============================================
-- VALVES
-- ============================================
INSERT INTO valves (serial_number, status, location)
VALUES
('V-1001', 'raw', 'inventory'),
('V-1002', 'raw', 'inventory'),
('V-1003', 'raw', 'inventory'),
('V-1004', 'raw', 'inventory'),
('V-1005', 'raw', 'inventory'),
('V-1006', 'raw', 'inventory'),
('V-1007', 'raw', 'inventory'),
('V-1008', 'raw', 'inventory'),
('V-1009', 'raw', 'inventory'),
('V-1010', 'raw', 'inventory'),
('V-2001', 'salvaged', 'inventory'),
('V-2002', 'salvaged', 'inventory')
ON CONFLICT (serial_number) DO NOTHING;

-- ============================================
-- KITS
-- ============================================
INSERT INTO kits (kit_revision, clean_state, delivered_at, cleaned_at)
VALUES
('A', 'post_clean', NOW(), NOW()),
('A', 'post_clean', NOW(), NOW()),
('B', 'pre_clean', NOW(), NULL),
('B', 'post_clean', NOW(), NOW()),
('A1', 'post_clean', NOW(), NOW()),
('A1', 'post_clean', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- KIT PARTS
-- ============================================
INSERT INTO kit_parts (kit_id, part_name, required_quantity, actual_quantity)
SELECT k.kit_id, p.part_name, p.required_quantity, p.actual_quantity
FROM (
  VALUES
    (1, 'valve', 4, 4),
    (1, 'housing', 1, 1),
    (2, 'valve', 4, 3),
    (2, 'housing', 1, 1),
    (3, 'valve', 4, 0),
    (3, 'housing', 1, 1),
    (4, 'valve', 4, 4),
    (4, 'housing', 1, 1),
    (5, 'valve', 0, 0),
    (5, 'housing', 1, 1),
    (6, 'valve', 0, 0),
    (6, 'housing', 1, 1)
) AS p(kit_id, part_name, required_quantity, actual_quantity)
JOIN kits k ON k.kit_id = p.kit_id
ON CONFLICT DO NOTHING;

-- ============================================
-- IFM ASSEMBLIES
-- ============================================
INSERT INTO assemblies (assembly_type, serial_number, status)
VALUES
('IFM', 'IFM-001', 'built'),
('IFM', 'IFM-002', 'built'),
('IFM', 'IFM-003', 'built'),
('IFM', 'IFM-004', 'built'),
('IFM', 'IFM-005', 'built'),
('IFM', 'IFM-006', 'built')
ON CONFLICT (serial_number) DO NOTHING;

-- ============================================
-- INSTALL VALVES INTO IFMs
-- ============================================
WITH a AS (
  SELECT serial_number, assembly_id FROM assemblies
),
v AS (
  SELECT serial_number, valve_id FROM valves
)
INSERT INTO assemblies_parts (assembly_id, valve_id, installed_at, work_order_id)
VALUES
((SELECT assembly_id FROM a WHERE serial_number='IFM-001'), (SELECT valve_id FROM v WHERE serial_number='V-1001'), NOW(), (SELECT work_order_id FROM work_orders WHERE work_order_number='WO-1001')),
((SELECT assembly_id FROM a WHERE serial_number='IFM-001'), (SELECT valve_id FROM v WHERE serial_number='V-1002'), NOW(), (SELECT work_order_id FROM work_orders WHERE work_order_number='WO-1001')),

((SELECT assembly_id FROM a WHERE serial_number='IFM-002'), (SELECT valve_id FROM v WHERE serial_number='V-1003'), NOW(), (SELECT work_order_id FROM work_orders WHERE work_order_number='WO-1002')),
((SELECT assembly_id FROM a WHERE serial_number='IFM-002'), (SELECT valve_id FROM v WHERE serial_number='V-1004'), NOW(), (SELECT work_order_id FROM work_orders WHERE work_order_number='WO-1002')),

((SELECT assembly_id FROM a WHERE serial_number='IFM-003'), (SELECT valve_id FROM v WHERE serial_number='V-1005'), NOW(), (SELECT work_order_id FROM work_orders WHERE work_order_number='WO-1003')),
((SELECT assembly_id FROM a WHERE serial_number='IFM-003'), (SELECT valve_id FROM v WHERE serial_number='V-1006'), NOW(), (SELECT work_order_id FROM work_orders WHERE work_order_number='WO-1003')),

((SELECT assembly_id FROM a WHERE serial_number='IFM-004'), (SELECT valve_id FROM v WHERE serial_number='V-1007'), NOW(), (SELECT work_order_id FROM work_orders WHERE work_order_number='WO-1004')),
((SELECT assembly_id FROM a WHERE serial_number='IFM-004'), (SELECT valve_id FROM v WHERE serial_number='V-1008'), NOW(), (SELECT work_order_id FROM work_orders WHERE work_order_number='WO-1004')),

((SELECT assembly_id FROM a WHERE serial_number='IFM-005'), (SELECT valve_id FROM v WHERE serial_number='V-1009'), NOW(), (SELECT work_order_id FROM work_orders WHERE work_order_number='WO-1005')),
((SELECT assembly_id FROM a WHERE serial_number='IFM-005'), (SELECT valve_id FROM v WHERE serial_number='V-1010'), NOW(), (SELECT work_order_id FROM work_orders WHERE work_order_number='WO-1005')),

((SELECT assembly_id FROM a WHERE serial_number='IFM-006'), (SELECT valve_id FROM v WHERE serial_number='V-2001'), NOW(), (SELECT work_order_id FROM work_orders WHERE work_order_number='WO-1006')),
((SELECT assembly_id FROM a WHERE serial_number='IFM-006'), (SELECT valve_id FROM v WHERE serial_number='V-2002'), NOW(), (SELECT work_order_id FROM work_orders WHERE work_order_number='WO-1006'))
ON CONFLICT DO NOTHING;

-- ============================================
-- TEST EVENTS FOR IFMs
-- ============================================
INSERT INTO test_chambers (chamber_type, description)
VALUES ('MQC', 'Main Qualification Chamber')
ON CONFLICT (chamber_type) DO NOTHING;

WITH c AS (
  SELECT chamber_id FROM test_chambers WHERE chamber_type='MQC'
),
a AS (
  SELECT assembly_id, serial_number FROM assemblies WHERE assembly_type='IFM'
)
INSERT INTO test_events (assembly_id, chamber_id, result, parameters, retest_number)
SELECT
  a.assembly_id,
  c.chamber_id,
  CASE a.serial_number
    WHEN 'IFM-002' THEN 'fail'
    WHEN 'IFM-004' THEN 'fail'
    ELSE 'pass'
  END::test_result,
  jsonb_build_object('pressure', CASE a.serial_number
    WHEN 'IFM-002' THEN 95
    WHEN 'IFM-004' THEN 90
    ELSE 120
  END),
  1
FROM a CROSS JOIN c
ON CONFLICT DO NOTHING;

-- ============================================
-- PIF ASSEMBLIES
-- ============================================
INSERT INTO assemblies (assembly_type, serial_number, status)
VALUES
('PIF', 'PIF-01', 'built'),
('PIF', 'PIF-02', 'built'),
('PIF', 'PIF-03', 'built'),
('PIF', 'PIF-04', 'built')
ON CONFLICT (serial_number) DO NOTHING;

-- ============================================
-- INSTALL IFMs INTO PIFs (SAFE)
-- ============================================
WITH p AS (
  SELECT serial_number, assembly_id FROM assemblies WHERE assembly_type='PIF'
),
i AS (
  SELECT serial_number, assembly_id FROM assemblies WHERE assembly_type='IFM'
)
INSERT INTO assemblies_subassemblies (parent_assembly_id, child_assembly_id, installed_at, work_order_id)
VALUES
((SELECT assembly_id FROM p WHERE serial_number='PIF-01'), (SELECT assembly_id FROM i WHERE serial_number='IFM-001'), NOW(), (SELECT work_order_id FROM work_orders WHERE work_order_number='WO-2001')),
((SELECT assembly_id FROM p WHERE serial_number='PIF-02'), (SELECT assembly_id FROM i WHERE serial_number='IFM-002'), NOW(), (SELECT work_order_id FROM work_orders WHERE work_order_number='WO-2002')),
((SELECT assembly_id FROM p WHERE serial_number='PIF-03'), (SELECT assembly_id FROM i WHERE serial_number='IFM-004'), NOW(), (SELECT work_order_id FROM work_orders WHERE work_order_number='WO-2003')),
((SELECT assembly_id FROM p WHERE serial_number='PIF-04'), (SELECT assembly_id FROM i WHERE serial_number='IFM-003'), NOW(), (SELECT work_order_id FROM work_orders WHERE work_order_number='WO-2001'))
ON CONFLICT DO NOTHING;

-- ============================================
-- ISTC TEST EVENTS FOR PIFs
-- ============================================
INSERT INTO test_chambers (chamber_type, description)
VALUES ('ISTC', 'ISTC chamber for PIF testing')
ON CONFLICT (chamber_type) DO NOTHING;

WITH c AS (
  SELECT chamber_id FROM test_chambers WHERE chamber_type='ISTC'
),
p AS (
  SELECT assembly_id, serial_number FROM assemblies WHERE assembly_type='PIF'
)
INSERT INTO test_events (assembly_id, chamber_id, result, parameters, retest_number)
SELECT
  p.assembly_id,
  c.chamber_id,
  CASE p.serial_number
    WHEN 'PIF-02' THEN 'fail'
    WHEN 'PIF-03' THEN 'fail'
    ELSE 'pass'
  END::test_result,
  jsonb_build_object('vibration', CASE p.serial_number
    WHEN 'PIF-02' THEN 1.1
    WHEN 'PIF-03' THEN 1.3
    ELSE 0.2
  END),
  1
FROM p CROSS JOIN c
ON CONFLICT DO NOTHING;

-- ============================================
-- REMOVE FAILED IFMs FROM PIF-02 AND PIF-03
-- ============================================
WITH bad AS (
  SELECT asb.id, asb.child_assembly_id, asb.parent_assembly_id
  FROM assemblies_subassemblies asb
  JOIN assemblies p ON p.assembly_id = asb.parent_assembly_id
  WHERE p.serial_number IN ('PIF-02','PIF-03')
)
UPDATE assemblies_subassemblies
SET removed_at = NOW()
WHERE id IN (SELECT id FROM bad);

-- ============================================
-- IPU ASSEMBLIES
-- ============================================
INSERT INTO assemblies (assembly_type, serial_number, status)
VALUES
('IPU', 'IPU-01', 'built'),
('IPU', 'IPU-02', 'built')
ON CONFLICT (serial_number) DO NOTHING;

-- ============================================
-- INSTALL PIFs INTO IPUs
-- ============================================
WITH p AS (
  SELECT serial_number, assembly_id FROM assemblies WHERE assembly_type='PIF'
),
u AS (
  SELECT serial_number, assembly_id FROM assemblies WHERE assembly_type='IPU'
)
INSERT INTO assemblies_subassemblies (parent_assembly_id, child_assembly_id, installed_at, work_order_id)
VALUES
((SELECT assembly_id FROM u WHERE serial_number='IPU-01'), (SELECT assembly_id FROM p WHERE serial_number='PIF-01'), NOW(), (SELECT work_order_id FROM work_orders WHERE work_order_number='WO-3001')),
((SELECT assembly_id FROM u WHERE serial_number='IPU-02'), (SELECT assembly_id FROM p WHERE serial_number='PIF-04'), NOW(), (SELECT work_order_id FROM work_orders WHERE work_order_number='WO-3002'))
ON CONFLICT DO NOTHING;