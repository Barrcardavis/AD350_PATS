import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

export default function MovementsList() {
  const [movements, setMovements] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadMovements() {
      const { data, error } = await supabase
        .from("movements")
        .select("*")
        .order("movement_id", { ascending: true });

      if (error) {
        alert("Error loading movements");
      } else {
        setMovements(data);
      }
    }

    loadMovements();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this movement?")) return;

    const { error } = await supabase
      .from("movements")
      .delete()
      .eq("movement_id", id);

    if (error) {
      alert("Error deleting movement");
    } else {
      setMovements((prev) => prev.filter((m) => m.movement_id !== id));
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Movements</h1>

      {/* ADD MOVEMENT BUTTON (GREEN) */}
      <button
        onClick={() => navigate("/add-movement")}
        className="add-kit-btn"
      >
        + Add Movement
      </button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Entity</th>
            <th>From</th>
            <th>To</th>
            <th>Timestamp</th>
            <th>Work Order</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {movements.map((m) => (
            <tr key={m.movement_id}>
              <td>{m.movement_id}</td>
              <td>{m.entity_type} #{m.entity_id}</td>
              <td>{m.from_location}</td>
              <td>{m.to_location}</td>
              <td>{new Date(m.timestamp).toLocaleString()}</td>
              <td>{m.work_order_id || "—"}</td>

              <td>
                {/* VIEW BUTTON (BLUE DEFAULT) */}
                <button
                  onClick={() => navigate(`/movements/${m.movement_id}`)}
                >
                  View
                </button>

                {/* EDIT BUTTON (ORANGE) */}
                <button
                  onClick={() => navigate(`/edit-movement/${m.movement_id}`)}
                  className="edit-btn"
                >
                  Edit
                </button>

                {/* DELETE BUTTON (RED) */}
                <button
                  onClick={() => handleDelete(m.movement_id)}
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
