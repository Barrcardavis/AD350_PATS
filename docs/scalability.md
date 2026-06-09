# UI scalability plan for PATS

This document describes how the PATS UI scales across all core database tables in Supabase.  
The goal is to define a repeatable CRUD module pattern and apply it consistently.

---

## 1. Current database tables (Supabase public schema)

Primary entities we care about for UI:

- `kits`
- `assemblies`
- `work_orders`
- `movements`
- `test_chambers`
- `test_events`
- `valves`

Relational/junction tables (used via relationships, not full standalone UI modules):

- `kit_parts`
- `assemblies_parts`
- `assemblies_subassemblies`

---

## 2. Standard CRUD module pattern

Each primary entity gets a **CRUD module** with the same structure:

- **List page**  
  - Shows a table of records  
  - Supports basic sorting/filtering  
  - Links to Detail, Add, and Edit

- **Detail page**  
  - Shows full record details  
  - Shows related records (via junction tables where applicable)

- **Add page**  
  - Form to create a new record  
  - Validates required fields

- **Edit page**  
  - Form to update an existing record  
  - Reuses the same field layout as Add

All modules follow the same React/Vite pattern:

- One folder per entity under `src/modules/<entity>/`
- Shared components (tables, forms, layout) live under `src/components/`

---

## 3. Kits module (completed template)

**Entity:** `kits`  

Files (example):

- `src/modules/kits/KitsList.jsx`
- `src/modules/kits/KitDetail.jsx`
- `src/modules/kits/AddKit.jsx`
- `src/modules/kits/EditKit.jsx`

This module is the **template** for all other entities.  
To add a new entity, we copy this pattern and adjust:

- Table name in Supabase queries
- Field names and labels
- Any entity‑specific relationships

---

## 4. Planned modules by entity

### 4.1 Assemblies (`assemblies`)

- `AssembliesList.jsx`
- `AssemblyDetail.jsx`
- `AddAssembly.jsx`
- `EditAssembly.jsx`

Uses `assemblies_parts` and `assemblies_subassemblies` to show related parts and subassemblies on the detail page.

---

### 4.2 Work orders (`work_orders`)

- `WorkOrdersList.jsx`
- `WorkOrderDetail.jsx`
- `AddWorkOrder.jsx`
- `EditWorkOrder.jsx`

Can show related kits, movements, or test events as the model evolves.

---

### 4.3 Movements (`movements`)

- `MovementsList.jsx`
- `MovementDetail.jsx`
- `AddMovement.jsx`
- `EditMovement.jsx`

Tracks movement history for kits/parts/valves.

---

### 4.4 Test chambers (`test_chambers`)

- `TestChambersList.jsx`
- `TestChamberDetail.jsx`
- `AddTestChamber.jsx`
- `EditTestChamber.jsx`

---

### 4.5 Test events (`test_events`)

- `TestEventsList.jsx`
- `TestEventDetail.jsx`
- `AddTestEvent.jsx`
- `EditTestEvent.jsx`

---

### 4.6 Valves (`valves`)

- `ValvesList.jsx`
- `ValveDetail.jsx`
- `AddValve.jsx`
- `EditValve.jsx`

---

## 5. Navigation and routing

- Top‑level navigation includes links for:  
  `Kits`, `Assemblies`, `Work Orders`, `Movements`, `Test Chambers`, `Test Events`, `Valves`
- Each link routes to the corresponding List page.
- Routing pattern (example):

  - `/kits`, `/kits/:id`, `/kits/add`, `/kits/:id/edit`
  - `/assemblies`, `/assemblies/:id`, etc.

---

## 6. Implementation notes

- All Supabase access goes through a small data layer (e.g. `src/api/<entity>.js`) to keep components clean.
- Forms reuse shared input components where possible.
- Junction tables (`kit_parts`, `assemblies_parts`, `assemblies_subassemblies`) are surfaced on Detail pages via related lists, not as standalone modules.

This document reflects the **actual** Supabase schema and serves as the source of truth for UI expansion.
