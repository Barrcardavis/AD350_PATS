// src/modules/test_chambers/EditTestChamber.jsx

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

export default function EditTestChamber() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    chamber_type: "",
    description: ""
  });

  // Load the chamber being edited
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

      setForm({
        chamber_type: data.chamber_type,
        description: data.description
      });
    }

    loadChamber();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      chamber_type: form.chamber_type,
      description: form.description
    };

    const { error } = await supabase
      .from("test_chambers")
      .update(payload)
      .eq("chamber_id", id);

    if (error) {
      alert("Error updating test chamber");
    } else {
      navigate("/test-chambers");
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Edit Test Chamber</h1>

      <form onSubmit={handleSubmit} className="form-container">

        <label>Chamber Type</label>
        <input
          value={form.chamber_type}
          onChange={(e) =>
            setForm({ ...form, chamber_type: e.target.value })
          }
        />

        <label>Description</label>
        <textarea
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        {/* SAVE CHANGES BUTTON (ORANGE) */}
        <button type="submit" className="edit-btn">
          Save Changes
        </button>

        {/* CANCEL BUTTON (BLUE DEFAULT) */}
        <button
          type="button"
          onClick={() => navigate("/test-chambers")}
          style={{ marginLeft: "10px" }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
