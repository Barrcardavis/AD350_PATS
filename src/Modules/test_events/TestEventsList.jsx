// src/modules/test_events/TestEventsList.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

export default function TestEventsList() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [assemblies, setAssemblies] = useState([]);
  const [chambers, setChambers] = useState([]);

  // Load all data
  useEffect(() => {
    async function loadData() {
      // Load test events
      const { data: eventsData, error: eventsError } = await supabase
        .from("test_events")
        .select("*")
        .order("test_event_id", { ascending: true });

      if (eventsError) {
        alert("Error loading test events");
        return;
      }

      setEvents(eventsData || []);

      // Load assemblies
      const { data: assembliesData } = await supabase
        .from("assemblies")
        .select("assembly_id, assembly_name")
        .order("assembly_id", { ascending: true });

      setAssemblies(assembliesData || []);

      // Load chambers
      const { data: chambersData } = await supabase
        .from("test_chambers")
        .select("chamber_id, chamber_type")
        .order("chamber_id", { ascending: true });

      setChambers(chambersData || []);
    }

    loadData();
  }, []);

  // Helper lookups
  function getAssemblyName(id) {
    const a = assemblies.find((x) => x.assembly_id === id);
    return a ? a.assembly_name : `ID ${id}`;
  }

  function getChamberType(id) {
    const c = chambers.find((x) => x.chamber_id === id);
    return c ? c.chamber_type : `ID ${id}`;
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this test event?")) return;

    const { error } = await supabase
      .from("test_events")
      .delete()
      .eq("test_event_id", id);

    if (error) {
      alert("Error deleting test event");
    } else {
      setEvents((prev) => prev.filter((e) => e.test_event_id !== id));
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Test Events</h1>

      {/* ADD EVENT BUTTON (GREEN) */}
      <button
        onClick={() => navigate("/add-test-event")}
        className="add-kit-btn"
      >
        + Add Test Event
      </button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Assembly</th>
            <th>Chamber</th>
            <th>Result</th>
            <th>Retest #</th>
            <th>Timestamp</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {events.map((ev) => (
            <tr key={ev.test_event_id}>
              <td>{ev.test_event_id}</td>
              <td>{getAssemblyName(ev.assembly_id)}</td>
              <td>{getChamberType(ev.chamber_id)}</td>
              <td>{ev.result}</td>
              <td>{ev.retest_number}</td>
              <td>{ev.test_timestamp}</td>

              <td>
                {/* VIEW BUTTON (BLUE DEFAULT) */}
                <button
                  onClick={() => navigate(`/test-events/${ev.test_event_id}`)}
                >
                  View
                </button>

                {/* EDIT BUTTON (ORANGE) */}
                <button
                  onClick={() =>
                    navigate(`/edit-test-event/${ev.test_event_id}`)
                  }
                  className="edit-btn"
                >
                  Edit
                </button>

                {/* DELETE BUTTON (RED) */}
                <button
                  onClick={() => handleDelete(ev.test_event_id)}
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
