import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";

export default function AssemblyDetail() {
  const { assembly_id } = useParams();
  const navigate = useNavigate();

  const [assembly, setAssembly] = useState(null);

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
        setAssembly(data);
      }
    }

    loadAssembly();
  }, [assembly_id]);

  if (!assembly) return <h2>Loading assembly details...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Assembly Details</h1>

      <p><strong>ID:</strong> {assembly.assembly_id}</p>
      <p><strong>Type:</strong> {assembly.assembly_type}</p>
      <p><strong>Serial Number:</strong> {assembly.serial_number}</p>
      <p><strong>Status:</strong> {assembly.status}</p>

      <p>
        <strong>Created At:</strong>{" "}
        {new Date(assembly.created_at).toLocaleString()}
      </p>

      <p>
        <strong>Completed At:</strong>{" "}
        {assembly.completed_at
          ? new Date(assembly.completed_at).toLocaleString()
          : "—"}
      </p>

      <button onClick={() => navigate("/assemblies")}>
        Back to Assemblies
      </button>

      <button
        style={{ marginLeft: "12px" }}
        onClick={() => navigate(`/edit-assembly/${assembly.assembly_id}`)}
      >
        Edit Assembly
      </button>
    </div>
  );
}
