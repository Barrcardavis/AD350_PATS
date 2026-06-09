// src/modules/test_chambers/TestChamberDetail.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

export default function TestChamberDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chamber, setChamber] = useState(null);

  useEffect(() => {
    async function loadChamber() {
      const { data, error } = await supabase
        .from("test_chambers")
        .select("*")
        .eq("chamber_id", id)
        .single();

      if (error) {
        alert("Error loading test chamber");
        return;
      }

      setChamber(data);
    }

    loadChamber();
  }, [id]);

  if (!chamber) {
    return <p style={{ padding: "20px" }}>Loading...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Test Chamber Details</h1>

      <p><strong>ID:</strong> {chamber.chamber_id}</p>
      <p><strong>Chamber Type:</strong> {chamber.chamber_type}</p>
      <p><strong>Description:</strong> {chamber.description}</p>

      {/* EDIT BUTTON (ORANGE) */}
      <button
        onClick={() => navigate(`/edit-test-chamber/${chamber.chamber_id}`)}
        className="edit-btn"
        style={{ marginRight: "10px" }}
      >
        Edit
      </button>

      {/* BACK BUTTON (BLUE DEFAULT) */}
      <button onClick={() => navigate("/test-chambers")}>
        Back
      </button>
    </div>
  );
}
