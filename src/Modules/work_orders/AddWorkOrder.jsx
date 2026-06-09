// src/modules/work_orders/AddWorkOrder.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

export default function AddWorkOrder() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    work_order_number: "",
    description: "",
    closed_at: "" // optional
  });

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      work_order_number: form.work_order_number,
      description: form.description,
      created_at: new Date().toISOString(),
      closed_at: form.closed_at ? new Date(form.closed_at).toISOString() : null
    };

    const { error } = await supabase
      .from("work_orders")
      .insert([payload]);

    if (error) {
      alert("Error adding work order");
    } else {
      navigate("/work-orders");
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Add Work Order</h1>

      <form onSubmit={handleSubmit} className="form-container">

        <label>Work Order Number</label>
        <input
          value={form.work_order_number}
          onChange={(e) =>
            setForm({ ...form, work_order_number: e.target.value })
          }
        />

        <label>Description</label>
        <textarea
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <label>Closed Date (optional)</label>
        <input
          type="date"
          value={form.closed_at}
          onChange={(e) =>
            setForm({ ...form, closed_at: e.target.value })
          }
        />

        {/* SAVE BUTTON (GREEN) */}
        <button type="submit" className="add-kit-btn">
          Save Work Order
        </button>

        {/* CANCEL BUTTON (BLUE DEFAULT) */}
        <button
          type="button"
          onClick={() => navigate("/work-orders")}
          style={{ marginLeft: "10px" }}
        >
          Cancel
        </button>

      </form>
    </div>
  );
}
