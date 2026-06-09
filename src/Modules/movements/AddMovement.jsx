import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

export default function AddMovement() {
  const navigate = useNavigate();

  const [entityType, setEntityType] = useState("");
  const [entities, setEntities] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);

  const [form, setForm] = useState({
    entity_type: "",
    entity_id: "",
    from_location: "",
    to_location: "",
    timestamp: new Date().toISOString().slice(0, 16), // auto-fill NOW
    work_order_id: ""
  });

  // Load work orders
  useEffect(() => {
    async function loadWorkOrders() {
      const { data } = await supabase.from("work_orders").select("*");
      setWorkOrders(data || []);
    }
    loadWorkOrders();
  }, []);

  // Load assemblies, valves, or kits based on entity_type
  async function loadEntities(type) {
    let table = "";
    if (type === "assembly") table = "assemblies";
    if (type === "valve") table = "valves";
    if (type === "kit") table = "kits";

    const { data } = await supabase.from(table).select("*");
    setEntities(data || []);
  }

  function handleEntityTypeChange(e) {
    const type = e.target.value;
    setEntityType(type);
    setForm({ ...form, entity_type: type, entity_id: "" });
    loadEntities(type);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { error } = await supabase.from("movements").insert([form]);

    if (error) {
      alert("Error adding movement");
    } else {
      navigate("/movements");
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Add Movement</h1>

      <form onSubmit={handleSubmit} className="form-container">

        <label>Entity Type</label>
        <select value={entityType} onChange={handleEntityTypeChange}>
          <option value="">Select Type</option>
          <option value="assembly">Assembly</option>
          <option value="valve">Valve</option>
          <option value="kit">Kit</option>
        </select>

        {entityType && (
          <>
            <label>Select {entityType}</label>
            <select
              value={form.entity_id}
              onChange={(e) => setForm({ ...form, entity_id: e.target.value })}
            >
              <option value="">Select</option>

              {entities.map((item) => (
                <option
                  key={
                    item.assembly_id ||
                    item.valve_id ||
                    item.kit_id
                  }
                  value={
                    item.assembly_id ||
                    item.valve_id ||
                    item.kit_id
                  }
                >
                  {item.serial_number ||
                   item.kit_number ||
                   item.valve_serial ||
                   `ID ${item.id}`}
                </option>
              ))}
            </select>
          </>
        )}

        <label>From Location</label>
        <input
          value={form.from_location}
          onChange={(e) => setForm({ ...form, from_location: e.target.value })}
        />

        <label>To Location</label>
        <input
          value={form.to_location}
          onChange={(e) => setForm({ ...form, to_location: e.target.value })}
        />

        <label>Timestamp</label>
        <input
          type="datetime-local"
          value={form.timestamp}
          onChange={(e) => setForm({ ...form, timestamp: e.target.value })}
        />

        <label>Work Order (optional)</label>
        <select
          value={form.work_order_id}
          onChange={(e) => setForm({ ...form, work_order_id: e.target.value })}
        >
          <option value="">None</option>
          {workOrders.map((wo) => (
            <option key={wo.work_order_id} value={wo.work_order_id}>
              WO #{wo.work_order_id}
            </option>
          ))}
        </select>

        {/* SAVE BUTTON (GREEN) */}
        <button type="submit" className="add-kit-btn">
          Save Movement
        </button>

        {/* CANCEL BUTTON (BLUE DEFAULT) */}
        <button
          type="button"
          onClick={() => navigate("/movements")}
          style={{ marginLeft: "10px" }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
