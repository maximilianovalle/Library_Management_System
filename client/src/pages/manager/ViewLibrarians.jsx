import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/header/ManagerHeader";
import "./ViewLibrarians.css";

const ViewLibrarians = () => {
  const [librarians, setLibrarians] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [toast, setToast] = useState({ message: "", type: "" });
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

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
    }
  };

  const handleEdit = (lib) => {
    setEditingId(lib.Librarian_ID);
    setFormData(lib);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
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
      showToast(`${formData.First_Name} ${formData.Last_Name} updated successfully!`, "success");
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

  return (
    <div>
      <Header />
      <div className="manage-librarians-container">
        <h1 className="title">All Librarians</h1>

        {toast.message && (
          <div className={`toast ${toast.type}`}>{toast.message}</div>
        )}

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Are you sure you want to delete this librarian?</h3>
              <button className="confirm-btn" onClick={handleDelete}>Yes, Delete</button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        )}

        {editingId ? (
          <form onSubmit={handleUpdate} className="librarian-form">
            {Object.entries(formData).map(([key, value]) => (
              <input
                key={key}
                name={key}
                value={value || ""}
                onChange={handleChange}
                placeholder={key.replace(/_/g, ' ')}
                type={key.toLowerCase().includes("date") ? "date" : "text"}
                required={key !== "End_Date" && key !== "Pay_Rate"}
              />
            ))}
            <button type="submit">Update Librarian</button>
          </form>
        ) : (
          <div>
            {librarians.length > 0 ? librarians.map((lib, idx) => (
              <div key={idx} className="librarian-row">
                <span>{lib.First_Name} {lib.Last_Name} - {lib.Position} in {lib.Department}</span>
                <span>Hired: {lib.Hire_Date?.split("T")[0]}</span>
                {lib.End_Date && <span>Ended: {lib.End_Date?.split("T")[0]}</span>}
                <div className="actions">
                  <button className="edit-btn" onClick={() => handleEdit(lib)}>Edit</button>
                  <button className="delete-btn" onClick={() => confirmDelete(lib.Librarian_ID)}>Delete</button>
                </div>
              </div>
            )) : <p>No librarians found.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewLibrarians;