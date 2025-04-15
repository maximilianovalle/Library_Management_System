import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/ManagerHeader";
import "./ViewLibrarians.css";

const ViewLibrarians = () => {
  const [librarians, setLibrarians] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [toast, setToast] = useState({ message: "", type: "" });
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchLibrarians();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  const fetchLibrarians = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/view_librarians`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLibrarians(res.data);
    } catch (err) {
      console.error("Error fetching librarians:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (lib) => {
    setEditingId(lib.Librarian_ID);
    setFormData({
      ...lib,
      Hire_Date: lib.Hire_Date?.split("T")[0] || getToday(),
      End_Date: lib.Is_Active === 1 ? "" : lib.End_Date?.split("T")[0] || getToday(),
    });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${process.env.REACT_APP_API_URL}/update_librarians/${editingId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("Librarian updated successfully!");
      setEditingId(null);
      fetchLibrarians();
    } catch (error) {
      console.error("Update failed:", error);
      showToast("Failed to update librarian", "error");
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.REACT_APP_API_URL}/delete_librarians/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("Librarian deleted successfully!", "error");
      fetchLibrarians();
      setShowModal(false);
      setDeleteId(null);
    } catch (error) {
      showToast("Failed to delete librarian.", "error");
      console.error("Delete failed:", error);
    }
  };

  const getToday = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <div>
      <Header />
      <div className="manage-librarians-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1 className="title">All Librarians</h1>

        {toast.message && <div className={`toast ${toast.type}`}>{toast.message}</div>}

        {loading ? (
          <div className="spinner"></div>
        ) : editingId ? (
          <div className="edit-modal">
            <button className="close-btn" onClick={() => setEditingId(null)}>×</button>
            <form onSubmit={handleUpdate} className="librarian-form" autoComplete="off">
              {Object.entries(formData).map(([key, value]) => (
                <input
                  key={key}
                  name={key}
                  value={value || ""}
                  onChange={handleChange}
                  placeholder={
                    key === "Is_Active"
                      ? "0 is inactive, 1 is active"
                      : key.replace(/_/g, " ")
                  }
                  type={key.toLowerCase().includes("date") ? "date" : "text"}
                  required={key !== "End_Date" && key !== "Pay_Rate"}
                />
              ))}
              <button type="submit">Update Librarian</button>
            </form>
          </div>
        ) : (
          <>
            {showModal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h3>Are you sure you want to delete this librarian?</h3>
                  <button className="confirm-btn" onClick={handleDelete}>Yes, Delete</button>
                  <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </div>
            )}

            {librarians.length > 0 ? (
              librarians.map((lib, idx) => (
                <div key={idx} className="librarian-row">
                  <div className="card-header">
                    <span className="position-badge">
                      {lib.Position} {!lib.End_Date && (
                        <span className="active-indicator" title="Current Employee">*</span>
                      )}
                    </span>
                  </div>
                  <span>{lib.First_Name} {lib.Last_Name} - {lib.Department}</span>
                  <span>Hired: {lib.Hire_Date?.split("T")[0]}</span>
                  {lib.End_Date && <span>Ended: {lib.End_Date?.split("T")[0]}</span>}
                  <div className="actions">
                    <button className="edit-btn" onClick={() => handleEdit(lib)}>Edit</button>
                    <button className="delete-btn" onClick={() => confirmDelete(lib.Librarian_ID)}>Delete</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No librarians found.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ViewLibrarians;
