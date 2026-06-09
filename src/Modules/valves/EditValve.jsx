// src/modules/valves/EditValve.jsx

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

export default function EditValve() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [valves, setValves] = useState([]);

  const [form, setForm] = useState({
    serial_number: "",
    status: "",
    location: "",
    harvested_from_valve_id: ""
  });

  // Load the valve being edited
  useEffect(() => {
    async function loadValve() {
      const { data, error } = await supabase
        .from("valves")
        .select("*")
        .eq("valve_id", id)
        .single();

      if (error) {
        alert("Error loading valve");
        return;
      }

      setForm({
        serial_number: data.serial_number,
        status: data.status,
        location: data.location,
        harvested_from_valve_id: data.harvested_from_valve_id || ""
      });
    }

    loadValve();
  }, [id]);

  // Load all valves for the harvested-from dropdown
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

    const { error } = await supabase
      .from("valves")
      .update(payload)
      .eq("valve_id", id);

    if (error) {
      alert("Error updating valve");
    } else {
      navigate("/valves");
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Edit Valve</h1>

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

        {/* SAVE CHANGES BUTTON (ORANGE) */}
        <button type="submit" className="edit-btn">
          Save Changes
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
