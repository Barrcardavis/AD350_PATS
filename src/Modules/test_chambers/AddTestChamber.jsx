// src/modules/test_chambers/AddTestChamber.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

export default function AddTestChamber() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    chamber_type: "",
    description: ""
  });

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      chamber_type: form.chamber_type,
      description: form.description
    };

    const { error } = await supabase
      .from("test_chambers")
      .insert([payload]);

    if (error) {
      alert("Error adding test chamber");
    } else {
      navigate("/test-chambers");
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Add Test Chamber</h1>

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

        {/* SAVE BUTTON (GREEN) */}
        <button type="submit" className="add-kit-btn">
          Save Chamber
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
