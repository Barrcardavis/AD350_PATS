// src/modules/test_chambers/TestChambersList.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

export default function TestChambersList() {
  const [chambers, setChambers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadChambers() {
      const { data, error } = await supabase
        .from("test_chambers")
        .select("*")
        .order("chamber_id", { ascending: true });

      if (error) {
        alert("Error loading test chambers");
      } else {
        setChambers(data);
      }
    }

    loadChambers();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this test chamber?")) return;

    const { error } = await supabase
      .from("test_chambers")
      .delete()
      .eq("chamber_id", id);

    if (error) {
      alert("Error deleting chamber");
    } else {
      setChambers((prev) => prev.filter((c) => c.chamber_id !== id));
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Test Chambers</h1>

      {/* ADD CHAMBER BUTTON (GREEN) */}
      <button
        onClick={() => navigate("/add-test-chamber")}
        className="add-kit-btn"
      >
        + Add Test Chamber
      </button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Chamber Type</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {chambers.map((c) => (
            <tr key={c.chamber_id}>
              <td>{c.chamber_id}</td>
              <td>{c.chamber_type}</td>
              <td>{c.description}</td>

              <td>
                {/* VIEW BUTTON (BLUE DEFAULT) */}
                <button
                  onClick={() => navigate(`/test-chambers/${c.chamber_id}`)}
                >
                  View
                </button>

                {/* EDIT BUTTON (ORANGE) */}
                <button
                  onClick={() => navigate(`/edit-test-chamber/${c.chamber_id}`)}
                  className="edit-btn"
                >
                  Edit
                </button>

                {/* DELETE BUTTON (RED) */}
                <button
                  onClick={() => handleDelete(c.chamber_id)}
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
