// src/modules/work_orders/WorkOrdersList.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

export default function WorkOrdersList() {
  const [workOrders, setWorkOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadWorkOrders() {
      const { data, error } = await supabase
        .from("work_orders")
        .select("*")
        .order("work_order_id", { ascending: true });

      if (error) {
        alert("Error loading work orders");
      } else {
        setWorkOrders(data);
      }
    }

    loadWorkOrders();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this work order?")) return;

    const { error } = await supabase
      .from("work_orders")
      .delete()
      .eq("work_order_id", id);

    if (error) {
      alert("Error deleting work order");
    } else {
      setWorkOrders((prev) => prev.filter((w) => w.work_order_id !== id));
    }
  }

  function getStatus(closedAt) {
    return closedAt ? "Closed" : "Open";
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Work Orders</h1>

      {/* ADD WORK ORDER BUTTON (GREEN) */}
      <button
        onClick={() => navigate("/add-work-order")}
        className="add-kit-btn"
      >
        + Add Work Order
      </button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Work Order #</th>
            <th>Description</th>
            <th>Created At</th>
            <th>Closed At</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {workOrders.map((w) => (
            <tr key={w.work_order_id}>
              <td>{w.work_order_id}</td>
              <td>{w.work_order_number}</td>
              <td>{w.description}</td>
              <td>{w.created_at}</td>
              <td>{w.closed_at || "—"}</td>
              <td>{getStatus(w.closed_at)}</td>

              <td>
                {/* VIEW BUTTON (BLUE DEFAULT) */}
                <button
                  onClick={() => navigate(`/work-orders/${w.work_order_id}`)}
                >
                  View
                </button>

                {/* EDIT BUTTON (ORANGE) */}
                <button
                  onClick={() => navigate(`/edit-work-order/${w.work_order_id}`)}
                  className="edit-btn"
                >
                  Edit
                </button>

                {/* DELETE BUTTON (RED) */}
                <button
                  onClick={() => handleDelete(w.work_order_id)}
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
