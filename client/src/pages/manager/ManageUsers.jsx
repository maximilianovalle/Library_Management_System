import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoIosSearch, IoIosAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { MdOutlineModeEdit, MdDelete } from "react-icons/md";
import Header from "../../components/header/ManagerHeader";
import "./ManageLibrarians.css";

const LibrarianManager = () => {
  const [activeTab, setActiveTab] = useState("add");
  const [formData, setFormData] = useState({
    First_Name: "",
    Last_Name: "",
    Password: "",
    Department: "",
    Position: "",
    SSN: "",
    Hire_Date: "",
    Pay_Rate: ""
  });
  const [toast, setToast] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const [librarians, setLibrarians] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");    // retrieve token from frontend localStorage

      // if ( no token )
      if (!token) {
          console.error("No token found. Redirecting to login...");
          window.location.href = "/login";
          return;
      }

    } catch (error) {
      console.error("Error fetching info: ", error);
    }

    if (activeTab === "view") {
      fetchLibrarians();
    }
  }, [activeTab]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.post(`${process.env.REACT_APP_API_URL}/add_librarian`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast(`${formData.First_Name} ${formData.Last_Name} added successfully!`);
      setFormData({
        First_Name: "",
        Last_Name: "",
        Password: "",
        Department: "",
        Position: "",
        SSN: "",
        Hire_Date: "",
        Pay_Rate: ""
      });
    } catch (error) {
      console.error("Add librarian failed:", error);
      showToast("Failed to add librarian.", "error");
    } finally {
      setLoading(false);
    }
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
    setFormData({
      ...lib,
      Hire_Date: lib.Hire_Date?.split("T")[0] || getToday(),
      End_Date: lib.Is_Active === 1 ? "" : lib.End_Date?.split("T")[0] || getToday(),
    });
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

  const getToday = () => new Date().toISOString().split("T")[0];

  return (
    <div>
      <Header />
      <div className="manage-librarians-container mainManage">

      <h2 id="dashboardTitle" class="dashboard-title manageLibrariansTitle">Manage Librarians</h2>

        <div className="tab-buttons dashboard-header dashboard-title">
          <button
            className={`tab-button ${activeTab === "add" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("add");
              setEditingId(null); // Clear any edit state
              setFormData({
                First_Name: "",
                Last_Name: "",
                Password: "",
                Department: "",
                Position: "",
                SSN: "",
                Hire_Date: "",
                Pay_Rate: ""
              }); // Reset form
            }}
          >
            <IoIosAdd /> Add Librarian
          </button>
          
          <button
            className={`tab-button ${activeTab === "view" ? "active" : ""}`}
            onClick={() => setActiveTab("view")}
          >
            <IoIosSearch /> View All Librarians
          </button>
        </div>

        {toast.message && <div className={`toast ${toast.type}`}>{toast.message}</div>}

        {activeTab === "add" && (
          <div className="form-section">

            <form onSubmit={handleAdd} className="librarian-form" autoComplete="off">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="form-group">
                  <label htmlFor={key}>{key.replace(/_/g, " ")}</label>
                  <input
                    id={key}
                    name={key}
                    value={value}
                    onChange={handleChange}
                    type={key.toLowerCase().includes("date") ? "date" : "text"}
                    required={key !== "Pay_Rate"}
                  />
                </div>
              ))}
              <button type="submit" disabled={loading}>
                {loading ? (
                  <div className="spinner" style={{ margin: "0 auto" }}></div>
                ) : (
                  "Add Librarian"
                )}
              </button>
            </form>
          </div>
        )}

        {activeTab === "view" && (
          <>
            {showModal && (
              <div className="modal-overlay">
                <div className="modal-box">
                  <span className="modal-close" onClick={() => setShowModal(null)}>&times;</span>

                  <h2 class="modalHeader">Delete librarian?</h2>

                  <p>This action cannot be undone.</p>
                  <button className="confirm-btn" onClick={handleDelete}>Yes, Delete</button>
                  <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </div>
            )}

            {editingId ? (
              <div className="edit-modal">
                <button className="close-btn" onClick={() => setEditingId(null)}>×</button>
                <form onSubmit={handleUpdate} className="librarian-form" autoComplete="off">
                  {Object.entries(formData).map(([key, value]) => (
                    <div key={key} className="form-group">
                      <label htmlFor={key}>{key.replace(/_/g, " ")}</label>
                      <input
                        id={key}
                        name={key}
                        value={value || ""}
                        onChange={handleChange}
                        type={key.toLowerCase().includes("date") ? "date" : "text"}
                        required={key !== "End_Date" && key !== "Pay_Rate"}
                      />
                    </div>
                  ))}
                  <button type="submit">Update Librarian</button>
                </form>
              </div>
            ) : (
              <div id="containsAllLibrarians">
                {librarians.length > 0 ? (
                  librarians.map((lib, idx) => (
                    <div key={idx} className="librarian-row">

                      <div id="librarianRowSpacing">
                      <div className="card-header">

                        <h3 class="libName entryElement">{lib.First_Name} {lib.Last_Name}</h3>

                        <span className="entryElement">
                          {!lib.End_Date && (
                            <span className="entryElement active-indicator" title="Current Employee">ACTIVE SINCE</span>
                          )}
                          {lib.End_Date && (
                            <span className="entryElement active-indicator" title="Current Employee">NOT ACTIVE</span>
                          )}
                        </span>

                      </div>

                      <div class="card-header">

                        <div>
                          <span className="entryElement">{lib.Position}, {lib.Department}</span>

                        </div>

                      <span className="entryElement">
                        
                        {lib.Hire_Date &&
                          new Date(lib.Hire_Date).toLocaleDateString("en-US", {
                            year: "numeric", month: "long", day: "numeric"
                          })}
                        {lib.End_Date && (
                          <span className="entryElement">
                            {" "}–{" "}
                            {new Date(lib.End_Date).toLocaleDateString("en-US", {
                              year: "numeric", month: "long", day: "numeric"
                            })}
                          </span>
                        )}
                      </span>

                      </div>
                      </div>

                      <div className="actions">
                        <button className="edit-btn" onClick={() => handleEdit(lib)}><MdOutlineModeEdit /> Edit</button>
                        <button className="delete-btn" onClick={() => confirmDelete(lib.Librarian_ID)}><MdDelete /> Delete</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No librarians found.</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LibrarianManager;
