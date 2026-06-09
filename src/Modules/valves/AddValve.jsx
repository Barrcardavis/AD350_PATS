// src/modules/valves/AddValve.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

export default function AddValve() {
  const navigate = useNavigate();

  const [valves, setValves] = useState([]);

  const [form, setForm] = useState({
    serial_number: "",
    status: "",
    location: "",
    harvested_from_valve_id: ""
  });

  // Load existing valves for the "harvested_from_valve_id" dropdown
  useEffect(() => {
    async function loadValves() {
      const { data } = await supabase
        .from("valves")
        .select("valve_id, serial_number")
        .order("valve_id", { ascending: true });

      setValves(data || []);
    }

    loadValves();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      serial_number: form.serial_number,
      status: form.status,
      location: form.location,
      harvested_from_valve_id:
        form.harvested_from_valve_id === "" ? null : form.harvested_from_valve_id
    };

    const { error } = await supabase.from("valves").insert([payload]);

    if (error) {
      alert("Error adding valve");
    } else {
      navigate("/valves");
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Add Valve</h1>

      <form onSubmit={handleSubmit} className="form-container">

        <label>Serial Number</label>
        <input
          value={form.serial_number}
          onChange={(e) =>
            setForm({ ...form, serial_number: e.target.value })
          }
        />

        <label>Status</label>
        <input
          value={form.status}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value })
          }
        />

        <label>Location</label>
        <input
          value={form.location}
          onChange={(e) =>
            setForm({ ...form, location: e.target.value })
          }
        />

        <label>Harvested From Valve (optional)</label>
        <select
          value={form.harvested_from_valve_id}
          onChange={(e) =>
            setForm({ ...form, harvested_from_valve_id: e.target.value })
          }
        >
          <option value="">None</option>

          {valves.map((v) => (
            <option key={v.valve_id} value={v.valve_id}>
              {v.serial_number} (ID {v.valve_id})
            </option>
          ))}
        </select>

        {/* SAVE BUTTON (GREEN) */}
        <button type="submit" className="add-kit-btn">
          Save Valve
        </button>

        {/* CANCEL BUTTON (BLUE DEFAULT) */}
        <button
          type="button"
          onClick={() => navigate("/valves")}
          style={{ marginLeft: "10px" }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
