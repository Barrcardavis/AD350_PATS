// src/modules/valves/ValveDetail.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

export default function ValveDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [valve, setValve] = useState(null);

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

      setValve(data);
    }

    loadValve();
  }, [id]);

  if (!valve) {
    return <p style={{ padding: "20px" }}>Loading...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Valve Details</h1>

      <p><strong>ID:</strong> {valve.valve_id}</p>
      <p><strong>Serial Number:</strong> {valve.serial_number}</p>
      <p><strong>Status:</strong> {valve.status}</p>
      <p><strong>Location:</strong> {valve.location}</p>
      <p><strong>Harvested From Valve:</strong> {valve.harvested_from_valve_id || "—"}</p>

      {/* EDIT BUTTON (ORANGE) */}
      <button
        onClick={() => navigate(`/edit-valve/${valve.valve_id}`)}
        className="edit-btn"
        style={{ marginRight: "10px" }}
      >
        Edit
      </button>

      {/* BACK BUTTON (BLUE DEFAULT) */}
      <button onClick={() => navigate("/valves")}>
        Back
      </button>
    </div>
  );
}
