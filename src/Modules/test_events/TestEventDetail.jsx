// src/modules/test_events/TestEventDetail.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

export default function TestEventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState(null);
  const [assemblyName, setAssemblyName] = useState("");
  const [chamberType, setChamberType] = useState("");

  useEffect(() => {
    async function loadEvent() {
      // Load event
      const { data: event, error } = await supabase
        .from("test_events")
        .select("*")
        .eq("test_event_id", id)
        .single();

      if (error) {
        alert("Error loading test event");
        return;
      }

      setEventData(event);

      // Load assembly name
      const { data: assembly } = await supabase
        .from("assemblies")
        .select("assembly_name")
        .eq("assembly_id", event.assembly_id)
        .single();

      setAssemblyName(assembly?.assembly_name || `ID ${event.assembly_id}`);

      // Load chamber type
      const { data: chamber } = await supabase
        .from("test_chambers")
        .select("chamber_type")
        .eq("chamber_id", event.chamber_id)
        .single();

      setChamberType(chamber?.chamber_type || `ID ${event.chamber_id}`);
    }

    loadEvent();
  }, [id]);

  if (!eventData) {
    return <p style={{ padding: "20px" }}>Loading...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Test Event Details</h1>

      <p><strong>ID:</strong> {eventData.test_event_id}</p>
      <p><strong>Assembly:</strong> {assemblyName}</p>
      <p><strong>Chamber:</strong> {chamberType}</p>
      <p><strong>Result:</strong> {eventData.result}</p>
      <p><strong>Retest Number:</strong> {eventData.retest_number}</p>
      <p><strong>Timestamp:</strong> {eventData.test_timestamp}</p>

      <p><strong>Parameters:</strong></p>
      <pre
        style={{
          background: "#f4f4f4",
          padding: "10px",
          borderRadius: "4px",
          fontSize: "14px",
          overflowX: "auto"
        }}
      >
        {JSON.stringify(eventData.parameters, null, 2)}
      </pre>

      {/* EDIT BUTTON (ORANGE) */}
      <button
        onClick={() => navigate(`/edit-test-event/${eventData.test_event_id}`)}
        className="edit-btn"
        style={{ marginRight: "10px" }}
      >
        Edit
      </button>

      {/* BACK BUTTON (BLUE DEFAULT) */}
      <button onClick={() => navigate("/test-events")}>
        Back
      </button>
    </div>
  );
}
