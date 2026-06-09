// src/modules/valves/ValvesList.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

export default function ValvesList() {
  const [valves, setValves] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadValves() {
      const { data, error } = await supabase
        .from("valves")
        .select("*")
        .order("valve_id", { ascending: true });

      if (error) {
        alert("Error loading valves");
      } else {
        setValves(data);
      }
    }

    loadValves();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this valve?")) return;

    const { error } = await supabase
      .from("valves")
      .delete()
      .eq("valve_id", id);

    if (error) {
      alert("Error deleting valve");
    } else {
      setValves((prev) => prev.filter((v) => v.valve_id !== id));
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Valves</h1>

      {/* ADD VALVE BUTTON (GREEN) */}
      <button
        onClick={() => navigate("/add-valve")}
        className="add-kit-btn"
      >
        + Add Valve
      </button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Serial Number</th>
            <th>Status</th>
            <th>Location</th>
            <th>Harvested From</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {valves.map((v) => (
            <tr key={v.valve_id}>
              <td>{v.valve_id}</td>
              <td>{v.serial_number}</td>
              <td>{v.status}</td>
              <td>{v.location}</td>
              <td>{v.harvested_from_valve_id || "—"}</td>

              <td>
                {/* VIEW BUTTON (BLUE DEFAULT) */}
                <button
                  onClick={() => navigate(`/valves/${v.valve_id}`)}
                >
                  View
                </button>

                {/* EDIT BUTTON (ORANGE) */}
                <button
                  onClick={() => navigate(`/edit-valve/${v.valve_id}`)}
                  className="edit-btn"
                >
                  Edit
                </button>

                {/* DELETE BUTTON (RED) */}
                <button
                  onClick={() => handleDelete(v.valve_id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
