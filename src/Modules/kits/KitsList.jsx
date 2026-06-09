import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import "../../App.css";

export default function KitsList() {
  const navigate = useNavigate();

  // Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [kitToDelete, setKitToDelete] = useState(null);

  // Data + Table State
  const [kits, setKits] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("kit_id");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Load kits
  useEffect(() => {
    async function loadKits() {
      const { data, error } = await supabase.from("kits").select("*");
      if (error) console.error(error);
      else setKits(data);
    }
    loadKits();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter, sortBy]);

  // SEARCH
  const searchedKits = kits.filter((k) => {
    const term = search.toLowerCase();
    return (
      k.kit_id.toString().includes(term) ||
      k.kit_revision.toLowerCase().includes(term) ||
      k.clean_state.toLowerCase().includes(term)
    );
  });

  // FILTER
  const filteredKits =
    filter === "all"
      ? searchedKits
      : searchedKits.filter((k) => k.clean_state === filter);

  // SORT
  const sortedKits = [...filteredKits].sort((a, b) => {
    if (sortBy === "kit_id") return a.kit_id - b.kit_id;
    if (sortBy === "kit_revision")
      return a.kit_revision.localeCompare(b.kit_revision);
    if (sortBy === "delivered_at")
      return new Date(b.delivered_at) - new Date(a.delivered_at);
    return 0;
  });

  // PAGINATION
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedKits.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedKits.length / itemsPerPage);

  // DELETE HANDLERS
  const openDeleteModal = (kitId) => {
    setKitToDelete(kitId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    const { error } = await supabase
      .from("kits")
      .delete()
      .eq("kit_id", kitToDelete);

    if (error) alert("Error deleting kit: " + error.message);
    else alert("Kit deleted successfully!");

    setShowDeleteModal(false);
    setKitToDelete(null);
    window.location.reload();
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setKitToDelete(null);
  };

  return (
    <div>

      <h1>Kits List</h1>

      {/* Add Kit Button */}
      <button className="add-kit-btn" onClick={() => navigate("/add-kit")}>
        + Add New Kit
      </button>

      {/* Search / Filter / Sort */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by ID, revision, or state..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "6px 10px", width: "240px", marginRight: "20px" }}
        />

        <label style={{ marginRight: "10px" }}>
          Filter:
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ marginLeft: "8px" }}
          >
            <option value="all">All</option>
            <option value="post_clean">Post Clean</option>
            <option value="pre_clean">Pre Clean</option>
          </select>
        </label>

        <label style={{ marginLeft: "20px" }}>
          Sort:
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ marginLeft: "8px" }}
          >
            <option value="kit_id">Kit ID</option>
            <option value="kit_revision">Revision</option>
            <option value="delivered_at">Delivered Date</option>
          </select>
        </label>
      </div>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>Kit ID</th>
            <th>Revision</th>
            <th>Clean State</th>
            <th>Delivered At</th>
            <th>Cleaned At</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {currentItems.map((kit) => (
            <tr key={kit.kit_id}>
              <td>{kit.kit_id}</td>
              <td>{kit.kit_revision}</td>
              <td>{kit.clean_state}</td>
              <td>{new Date(kit.delivered_at).toLocaleString()}</td>
              <td>
                {kit.cleaned_at
                  ? new Date(kit.cleaned_at).toLocaleString()
                  : "—"}
              </td>

              <td>
                <button onClick={() => navigate(`/kits/${kit.kit_id}`)}>
                  View Details
                </button>

                <button
                  className="edit-btn"
                  onClick={() => navigate(`/edit-kit/${kit.kit_id}`)}
                  style={{ marginLeft: "8px" }}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  style={{ marginLeft: "8px" }}
                  onClick={() => openDeleteModal(kit.kit_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ marginTop: "20px" }}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>

        <span style={{ margin: "0 12px" }}>
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete Kit {kitToDelete}?</p>

            <div className="modal-buttons">
              <button className="modal-cancel" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="modal-confirm" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
