// src/modules/movements/MovementDetail.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

export default function MovementDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movement, setMovement] = useState(null);

  useEffect(() => {
    async function loadMovement() {
      const { data, error } = await supabase
        .from("movements")
        .select("*")
        .eq("movement_id", id)
        .single();

      if (error) {
        alert("Error loading movement");
        return;
      }

      setMovement(data);
    }

    loadMovement();
  }, [id]);

  if (!movement) {
    return <p style={{ padding: "20px" }}>Loading...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Movement Details</h1>

      <p><strong>ID:</strong> {movement.movement_id}</p>
      <p><strong>Entity Type:</strong> {movement.entity_type}</p>
      <p><strong>Entity ID:</strong> {movement.entity_id}</p>
      <p><strong>From Location:</strong> {movement.from_location}</p>
      <p><strong>To Location:</strong> {movement.to_location}</p>
      <p><strong>Timestamp:</strong> {new Date(movement.timestamp).toLocaleString()}</p>
      <p><strong>Work Order:</strong> {movement.work_order_id || "—"}</p>

      {/* EDIT BUTTON (ORANGE) */}
      <button
        onClick={() => navigate(`/edit-movement/${movement.movement_id}`)}
        className="edit-btn"
        style={{ marginRight: "10px" }}
      >
        Edit
      </button>

      {/* BACK BUTTON (BLUE DEFAULT) */}
      <button onClick={() => navigate("/movements")}>
        Back
      </button>
    </div>
  );
}
