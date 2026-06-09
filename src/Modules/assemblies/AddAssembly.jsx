import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

export default function AddAssembly() {
  const navigate = useNavigate();

  const [assemblyType, setAssemblyType] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [status, setStatus] = useState("pending");
  const [completedAt, setCompletedAt] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const { error } = await supabase.from("assemblies").insert([
      {
        assembly_type: assemblyType,
        serial_number: serialNumber,
        status,
        completed_at: completedAt || null
      }
    ]);

    if (error) {
      alert("Error adding assembly: " + error.message);
    } else {
      alert("Assembly added successfully!");
      navigate("/assemblies");
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Add Assembly</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "0 auto" }}>
        
        <label>Assembly Type</label>
        <input
          type="text"
          value={assemblyType}
          onChange={(e) => setAssemblyType(e.target.value)}
          required
        />

        <label>Serial Number</label>
        <input
          type="text"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
          required
        />

        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="complete">Complete</option>
        </select>

        <label>Completed At (optional)</label>
        <input
          type="datetime-local"
          value={completedAt}
          onChange={(e) => setCompletedAt(e.target.value)}
        />

        <button type="submit" style={{ marginTop: "20px" }}>
          Add Assembly
        </button>
      </form>

      <button style={{ marginTop: "20px" }} onClick={() => navigate("/assemblies")}>
        Back to Assemblies
      </button>
    </div>
  );
}
