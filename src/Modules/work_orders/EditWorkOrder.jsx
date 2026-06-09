// src/modules/work_orders/EditWorkOrder.jsx

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

export default function EditWorkOrder() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    work_order_number: "",
    description: "",
    created_at: "",
    closed_at: ""
  });

  // Load the work order
  useEffect(() => {
    async function loadWorkOrder() {
      const { data, error } = await supabase
        .from("work_orders")
        .select("*")
        .eq("work_order_id", id)
        .single();

      if (error) {
        alert("Error loading work order");
        return;
      }

      setForm({
        work_order_number: data.work_order_number,
        description: data.description,
        created_at: data.created_at,
        closed_at: data.closed_at ? data.closed_at.split("T")[0] : ""
      });
    }

    loadWorkOrder();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      work_order_number: form.work_order_number,
      description: form.description,
      closed_at: form.closed_at ? new Date(form.closed_at).toISOString() : null
    };

    const { error } = await supabase
      .from("work_orders")
      .update(payload)
      .eq("work_order_id", id);

    if (error) {
      alert("Error updating work order");
    } else {
      navigate("/work-orders");
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Edit Work Order</h1>

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

        <label>Created At (read‑only)</label>
        <input value={form.created_at} disabled />

        <label>Closed Date (optional)</label>
        <input
          type="date"
          value={form.closed_at}
          onChange={(e) =>
            setForm({ ...form, closed_at: e.target.value })
          }
        />

        {/* SAVE CHANGES BUTTON (ORANGE) */}
        <button type="submit" className="edit-btn">
          Save Changes
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
