import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

export default function AssembliesList() {
  const [assemblies, setAssemblies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadAssemblies() {
      const { data, error } = await supabase
        .from("assemblies")
        .select("*")
        .order("assembly_id", { ascending: true });

      if (error) {
        console.error(error);
        alert("Error loading assemblies");
      } else {
        setAssemblies(data);
      }
    }

    loadAssemblies();
  }, []);

  async function handleDelete(id) {
    const confirmDelete = window.confirm("Delete this assembly?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("assemblies")
      .delete()
      .eq("assembly_id", id);

    if (error) {
      alert("Error deleting assembly: " + error.message);
    } else {
      alert("Assembly deleted.");
      setAssemblies((prev) => prev.filter((a) => a.assembly_id !== id));
    }
  }

  // Reusable button styles
  const btn = {
    padding: "6px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    color: "white",
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Assemblies</h1>

      {/* Add Assembly Button (Green) */}
      <button
        onClick={() => navigate("/add-assembly")}
        style={{
          ...btn,
          backgroundColor: "green",
          marginBottom: "15px",
        }}
      >
        + Add Assembly
      </button>

      <table style={{ marginTop: "10px", width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Serial</th>
            <th>Status</th>
            <th>Created</th>
            <th>Completed</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {assemblies.map((a) => (
            <tr key={a.assembly_id}>
              <td>{a.assembly_id}</td>
              <td>{a.assembly_type}</td>
              <td>{a.serial_number}</td>
              <td>{a.status}</td>
              <td>{new Date(a.created_at).toLocaleString()}</td>
              <td>
                {a.completed_at
                  ? new Date(a.completed_at).toLocaleString()
                  : "—"}
              </td>

              <td style={{ display: "flex", gap: "8px" }}>
                {/* View (Blue) */}
                <button
                  onClick={() => navigate(`/assemblies/${a.assembly_id}`)}
                  style={{ ...btn, backgroundColor: "#007bff" }}
                >
                  View
                </button>

                {/* Edit (Orange) */}
                <button
                  onClick={() => navigate(`/edit-assembly/${a.assembly_id}`)}
                  style={{ ...btn, backgroundColor: "orange" }}
                >
                  Edit
                </button>

                {/* Delete (Red) */}
                <button
                  onClick={() => handleDelete(a.assembly_id)}
                  style={{ ...btn, backgroundColor: "red" }}
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

