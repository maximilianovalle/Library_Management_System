import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/header/ManagerHeader";
import { useNavigate } from "react-router-dom";
import { IoIosAdd } from "react-icons/io";
import { MdOutlineModeEdit, MdDelete } from "react-icons/md";
import "./ViewLibrarians.css";

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [toast, setToast] = useState({ message: "", type: "" });
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const roleText = { 1: "Student", 2: "Alumni", 3: "Faculty" };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/view_user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.User_ID);
    setFormData({ ...user });
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
      await axios.put(`${process.env.REACT_APP_API_URL}/update_user/${editingId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("User updated successfully!");
      setEditingId(null);
      fetchUsers();
    } catch (error) {
      console.error("Update failed:", error);
      showToast("Failed to update user", "error");
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.REACT_APP_API_URL}/delete_user/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("User deleted successfully!", "error");
      fetchUsers();
      setShowModal(false);
      setDeleteId(null);
    } catch (error) {
      showToast("Failed to delete user.", "error");
      console.error("Delete failed:", error);
    }
  };

  return (
    <div>
      <Header />
      <div className="manage-librarians-container mainManage">
        <div className="container2">
          <h1 id="dashboardTitle" className="dashboard-title">All Users</h1>
          <button className="createLibBtn viewAllBtn" onClick={() => navigate("/manage-users")}>
            <IoIosAdd /> Create a User
          </button>
        </div>

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
                  placeholder={key.replace(/_/g, " ")}
                  type={key === "Role" ? "number" : "text"}
                  required
                />
              ))}
              <button type="submit">Update User</button>
            </form>
          </div>
        ) : (
          <>
            {showModal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h3>Are you sure you want to delete this user?</h3>
                  <button className="confirm-btn" onClick={handleDelete}>Yes, Delete</button>
                  <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </div>
            )}

            {users.map((user, idx) => (
              <div key={idx} className="librarian-row">
                <div className="card-header">
                  <h3 className="libName entryElement">{user.First_Name} {user.Last_Name}</h3>
                  <span className="position-badge">{roleText[user.Role] || "Unknown"}</span>
                </div>
                <span className="entryElement">{user.Email}</span>
                <span className="entryElement">
                  Created:{" "}
                  {new Date(user.Created_At).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <div className="actions">
                  <button className="edit-btn" onClick={() => handleEdit(user)}><MdOutlineModeEdit /> Edit</button>
                  <button className="delete-btn" onClick={() => confirmDelete(user.User_ID)}><MdDelete /> Delete</button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ViewUsers;
