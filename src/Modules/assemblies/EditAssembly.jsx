import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

export default function EditAssembly() {
  const { assembly_id } = useParams();
  const navigate = useNavigate();

  const [assemblyType, setAssemblyType] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [status, setStatus] = useState("pending");
  const [completedAt, setCompletedAt] = useState("");

  // Load assembly data
  useEffect(() => {
    async function loadAssembly() {
      const { data, error } = await supabase
        .from("assemblies")
        .select("*")
        .eq("assembly_id", assembly_id)
        .single();

      if (error) {
        console.error(error);
        alert("Error loading assembly");
      } else {
        setAssemblyType(data.assembly_type);
        setSerialNumber(data.serial_number);
        setStatus(data.status);
        setCompletedAt(data.completed_at ? data.completed_at.slice(0, 16) : "");
      }
    }

    loadAssembly();
  }, [assembly_id]);

  // Submit update
  async function handleSubmit(e) {
    e.preventDefault();

    const { error } = await supabase
      .from("assemblies")
      .update({
        assembly_type: assemblyType,
        serial_number: serialNumber,
        status,
        completed_at: completedAt || null
      })
      .eq("assembly_id", assembly_id);

    if (error) {
      alert("Error updating assembly: " + error.message);
    } else {
      alert("Assembly updated successfully!");
      navigate("/assemblies");
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Edit Assembly #{assembly_id}</h1>

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
          Save Changes
        </button>
      </form>

      <button style={{ marginTop: "20px" }} onClick={() => navigate("/assemblies")}>
        Back to Assemblies
      </button>
    </div>
  );
}
