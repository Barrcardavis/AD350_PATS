// src/modules/work_orders/WorkOrderDetail.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

export default function WorkOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workOrder, setWorkOrder] = useState(null);

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

      setWorkOrder(data);
    }

    loadWorkOrder();
  }, [id]);

  if (!workOrder) {
    return <p style={{ padding: "20px" }}>Loading...</p>;
  }

  const status = workOrder.closed_at ? "Closed" : "Open";

  return (
    <div style={{ padding: "20px" }}>
      <h1>Work Order Details</h1>

      <p><strong>ID:</strong> {workOrder.work_order_id}</p>
      <p><strong>Work Order Number:</strong> {workOrder.work_order_number}</p>
      <p><strong>Description:</strong> {workOrder.description}</p>
      <p><strong>Created At:</strong> {workOrder.created_at}</p>
      <p><strong>Closed At:</strong> {workOrder.closed_at || "—"}</p>
      <p><strong>Status:</strong> {status}</p>

      {/* EDIT BUTTON (ORANGE) */}
      <button
        onClick={() => navigate(`/edit-work-order/${workOrder.work_order_id}`)}
        className="edit-btn"
        style={{ marginRight: "10px" }}
      >
        Edit
      </button>

      {/* BACK BUTTON (BLUE DEFAULT) */}
      <button onClick={() => navigate("/work-orders")}>
        Back
      </button>
    </div>
  );
}
