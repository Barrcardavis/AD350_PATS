// src/modules/test_events/EditTestEvent.jsx

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

export default function EditTestEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assemblies, setAssemblies] = useState([]);
  const [chambers, setChambers] = useState([]);

  const [form, setForm] = useState({
    assembly_id: "",
    chamber_id: "",
    result: "",
    retest_number: 1,
    parameters: "{}"
  });

  // Load dropdowns + event data
  useEffect(() => {
    async function loadDropdowns() {
      const { data: assembliesData } = await supabase
        .from("assemblies")
        .select("assembly_id, assembly_name")
        .order("assembly_name", { ascending: true });

      const { data: chambersData } = await supabase
        .from("test_chambers")
        .select("chamber_id, chamber_type")
        .order("chamber_type", { ascending: true });

      setAssemblies(assembliesData || []);
      setChambers(chambersData || []);
    }

    async function loadEvent() {
      const { data, error } = await supabase
        .from("test_events")
        .select("*")
        .eq("test_event_id", id)
        .single();

      if (error) {
        alert("Error loading test event");
        return;
      }

      setForm({
        assembly_id: data.assembly_id,
        chamber_id: data.chamber_id,
        result: data.result,
        retest_number: data.retest_number,
        parameters: JSON.stringify(data.parameters, null, 2)
      });
    }

    loadDropdowns();
    loadEvent();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();

    let parsedParams = null;

    try {
      parsedParams = JSON.parse(form.parameters);
    } catch (err) {
      alert("Parameters must be valid JSON");
      return;
    }

    const payload = {
      assembly_id: form.assembly_id,
      chamber_id: form.chamber_id,
      result: form.result,
      retest_number: form.retest_number,
      parameters: parsedParams
    };

    const { error } = await supabase
      .from("test_events")
      .update(payload)
      .eq("test_event_id", id);

    if (error) {
      alert("Error updating test event");
    } else {
      navigate("/test-events");
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Edit Test Event</h1>

      <form onSubmit={handleSubmit} className="form-container">

        {/* Assembly Dropdown */}
        <label>Assembly</label>
        <select
          value={form.assembly_id}
          onChange={(e) =>
            setForm({ ...form, assembly_id: Number(e.target.value) })
          }
        >
          <option value="">Select Assembly</option>
          {assemblies.map((a) => (
            <option key={a.assembly_id} value={a.assembly_id}>
              {a.assembly_name}
            </option>
          ))}
        </select>

        {/* Chamber Dropdown */}
        <label>Chamber</label>
        <select
          value={form.chamber_id}
          onChange={(e) =>
            setForm({ ...form, chamber_id: Number(e.target.value) })
          }
        >
          <option value="">Select Chamber</option>
          {chambers.map((c) => (
            <option key={c.chamber_id} value={c.chamber_id}>
              {c.chamber_type}
            </option>
          ))}
        </select>

        {/* Result Dropdown */}
        <label>Result</label>
        <select
          value={form.result}
          onChange={(e) => setForm({ ...form, result: e.target.value })}
        >
          <option value="">Select Result</option>
          <option value="pass">Pass</option>
          <option value="fail">Fail</option>
        </select>

        {/* Retest Number */}
        <label>Retest Number</label>
        <input
          type="number"
          value={form.retest_number}
          onChange={(e) =>
            setForm({ ...form, retest_number: Number(e.target.value) })
          }
        />

        {/* JSON Parameters */}
        <label>Parameters (JSON)</label>
        <textarea
          value={form.parameters}
          onChange={(e) => setForm({ ...form, parameters: e.target.value })}
          style={{ fontFamily: "monospace", minHeight: "120px" }}
        />

        {/* SAVE CHANGES BUTTON (ORANGE) */}
        <button type="submit" className="edit-btn">
          Save Changes
        </button>

        {/* CANCEL BUTTON (BLUE DEFAULT) */}
        <button
          type="button"
          onClick={() => navigate("/test-events")}
          style={{ marginLeft: "10px" }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
