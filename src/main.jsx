import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App.jsx";

// Kits module
import KitsList from "./modules/kits/KitsList.jsx";
import KitDetail from "./modules/kits/KitDetail.jsx";
import AddKit from "./modules/kits/AddKit.jsx";
import EditKit from "./modules/kits/EditKit.jsx";

// Assemblies module
import AssembliesList from "./modules/assemblies/AssembliesList.jsx";
import AssemblyDetail from "./modules/assemblies/AssemblyDetail.jsx";
import AddAssembly from "./modules/assemblies/AddAssembly.jsx";
import EditAssembly from "./modules/assemblies/EditAssembly.jsx";

// Movements module
import MovementsList from "./modules/movements/MovementsList";
import AddMovement from "./modules/movements/AddMovement";
import EditMovement from "./modules/movements/EditMovement";
import MovementDetail from "./modules/movements/MovementDetail";

// Valves module
import ValvesList from "./modules/valves/ValvesList";
import AddValve from "./modules/valves/AddValve";
import EditValve from "./modules/valves/EditValve";
import ValveDetail from "./modules/valves/ValveDetail";

// ✅ Test Chambers module imports
import TestChambersList from "./modules/test_chambers/TestChambersList";
import AddTestChamber from "./modules/test_chambers/AddTestChamber";
import EditTestChamber from "./modules/test_chambers/EditTestChamber";
import TestChamberDetail from "./modules/test_chambers/TestChamberDetail";

// ✅ Test events module imports
import TestEventsList from "./modules/test_events/TestEventsList";
import AddTestEvent from "./modules/test_events/AddTestEvent";
import EditTestEvent from "./modules/test_events/EditTestEvent";
import TestEventDetail from "./modules/test_events/TestEventDetail";

// Work Orders module imports
import WorkOrdersList from "./modules/work_orders/WorkOrdersList";
import AddWorkOrder from "./modules/work_orders/AddWorkOrder";
import EditWorkOrder from "./modules/work_orders/EditWorkOrder";
import WorkOrderDetail from "./modules/work_orders/WorkOrderDetail";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>

      {/* Global layout wrapper */}
      <Route path="/" element={<App />}>

        {/* Kits module routes */}
        <Route index element={<KitsList />} />
        <Route path="kits/:kit_id" element={<KitDetail />} />
        <Route path="add-kit" element={<AddKit />} />
        <Route path="edit-kit/:kit_id" element={<EditKit />} />
        {/* Assemblies module routes */}
        <Route path="assemblies" element={<AssembliesList />} />
        <Route path="assemblies/:assembly_id" element={<AssemblyDetail />} />
        <Route path="add-assembly" element={<AddAssembly />} />
        <Route path="edit-assembly/:assembly_id" element={<EditAssembly />} />
        {/* Movements module routes */}
        <Route path="/movements" element={<MovementsList />} />
        <Route path="/add-movement" element={<AddMovement />} />
        <Route path="/movements/:id" element={<MovementDetail />} />
        <Route path="/edit-movement/:id" element={<EditMovement />} />
        {/* valves module routes */}
        <Route path="/valves" element={<ValvesList />} />
        <Route path="/add-valve" element={<AddValve />} />
        <Route path="/valves/:id" element={<ValveDetail />} />
        <Route path="/edit-valve/:id" element={<EditValve />} />

        {/* test chambers module routes */}
        <Route path="/test-chambers" element={<TestChambersList />} />
        <Route path="/add-test-chamber" element={<AddTestChamber />} />
        <Route path="/test-chambers/:id" element={<TestChamberDetail />} />
        <Route path="/edit-test-chamber/:id" element={<EditTestChamber />} />

        {/* test events module routes */}
      <Route path="/test-events" element={<TestEventsList />} />
      <Route path="/add-test-event" element={<AddTestEvent />} />
      <Route path="/test-events/:id" element={<TestEventDetail />} />
      <Route path="/edit-test-event/:id" element={<EditTestEvent />} />
  
        {/* Work Orders module routes  */}
        <Route path="/work-orders" element={<WorkOrdersList />} />
        <Route path="/add-work-order" element={<AddWorkOrder />} />
        <Route path="/work-orders/:id" element={<WorkOrderDetail />} />
        <Route path="/edit-work-order/:id" element={<EditWorkOrder />} />

      </Route>

    </Routes>
  </BrowserRouter>
);




