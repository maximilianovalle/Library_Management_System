import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoIosSearch, IoIosAdd } from "react-icons/io";
import { MdOutlineModeEdit, MdDelete, MdVisibility, MdVisibilityOff } from "react-icons/md";
import Header from "../../components/header/ManagerHeader";
import "./ManageLibrarians.css";

// Helper function to generate random passwords
const generateRandomPassword = () => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=";
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const LibrarianManager = () => {
  const [activeTab, setActiveTab] = useState("add");
  const [formData, setFormData] = useState({
    First_Name: "",
    Last_Name: "",
    Password: "",
    Department: "",
    Position: "",
    SSN: "",
    Hire_Date: getTodayDate(),
    Pay_Rate: "",
    Is_Active: 1
  });
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const [librarians, setLibrarians] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
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
    const { name, value } = e.target;
  
    // If user updates End_Date
    if (name === "End_Date") {
      const today = new Date().toISOString().split("T")[0];
      
      if (value > today) {
        showToast("End date cannot be in the future.", "error");
        return;
      }
  
      setFormData(prev => ({
        ...prev,
        End_Date: value,
        Is_Active: 0 // Auto-mark as inactive
      }));
      return;
    }
  
    // For all other fields
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleStatusChange = (isActive) => {
    setFormData(prev => ({
      ...prev,
      Is_Active: isActive ? 1 : 0,
      End_Date: isActive ? "" : getTodayDate()
    }));
  };

  const handleGeneratePassword = () => {
    const newPassword = generateRandomPassword();
    setFormData(prev => ({
      ...prev,
      Password: newPassword
    }));
    showToast("Random password generated!", "info");
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
        Hire_Date: getTodayDate(),
        Pay_Rate: "",
        Is_Active: 1
      });
      setShowPassword(false);
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
      Librarian_ID: lib.Librarian_ID,
      Hire_Date: lib.Hire_Date?.split("T")[0] || getTodayDate(),
      End_Date: lib.Is_Active === 1 ? "" : lib.End_Date?.split("T")[0] || getTodayDate(),
      Is_Active: lib.Is_Active
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

  return (
    <div>
      <Header />
      <div className="manage-librarians-container mainManage">
        <h2 id="dashboardTitle" className="dashboard-title manageLibrariansTitle">Manage Librarians</h2>

        <div className="tab-buttons dashboard-header dashboard-title">
          <button
            className={`tab-button ${activeTab === "add" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("add");
              setEditingId(null);
              setFormData({
                First_Name: "",
                Last_Name: "",
                Password: "",
                Department: "",
                Position: "",
                SSN: "",
                Hire_Date: getTodayDate(),
                Pay_Rate: "",
                Is_Active: 1
              });
              setShowPassword(false);
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
                  {key === "Password" ? (
                    <div className="password-input-container">
                      <input
                        id={key}
                        name={key}
                        value={value}
                        onChange={handleChange}
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="new-password" 
                      />
                      <button 
                        type="button" 
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
                      </button>
                      <button
                        type="button"
                        className="generate-password"
                        onClick={handleGeneratePassword}
                      >
                        Generate
                      </button>
                    </div>
                  ) : key === "Is_Active" ? (
                    <div className="status-buttons">
                      <button
                        type="button"
                        className={`status-btn ${value === 1 ? "active" : ""}`}
                        onClick={() => handleStatusChange(true)}
                        disabled
                      >
                        Active
                      </button>
                      {/* <button
                        type="button"
                        className={`status-btn ${value === 0 ? "active" : ""}`}
                        onClick={() => handleStatusChange(false)}
                      >
                        Inactive
                      </button> */}
                    </div>
                  ) : (
                    <input
                      id={key}
                      name={key}
                      value={value}
                      onChange={handleChange}
                      type={key.toLowerCase().includes("date") ? "date" : "text"}
                      required={key !== "Pay_Rate" && key !== "End_Date"}
                    />
                  )}
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
                  <h2 className="modalHeader">Delete librarian?</h2>
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
                      {key === "Password" ? (
                        <div className="password-input-container">
                          <input
                            id={key}
                            name={key}
                            value={value}
                            onChange={handleChange}
                            type={showPassword ? "text" : "password"}
                            required
                            
                          />
                          <button 
                            type="button" 
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                          </button>
                        </div>
                      ) : key === "Is_Active" ? (
                        <div className="status-buttons">
                          <button
                            type="button"
                            className={`status-btn ${value === 1 ? "active" : ""}`}
                            onClick={() => handleStatusChange(true)}
                          >
                            Active
                          </button>
                          <button
                            type="button"
                            className={`status-btn ${value === 0 ? "active" : ""}`}
                            onClick={() => handleStatusChange(false)}
                          >
                            Inactive
                          </button>
                        </div>
                      ) : (
                        <input
                          id={key}
                          name={key}
                          value={value || ""}
                          onChange={handleChange}
                          type={key.toLowerCase().includes("date") ? "date" : "text"}
                          required={key !== "End_Date" && key !== "Pay_Rate"}
                          disabled={key === "Librarian_ID"}
                        />
                      )}
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
                          <h3 className="libName entryElement">{lib.First_Name} {lib.Last_Name}</h3>
                          <span className="entryElement">
                            <span className={`status-indicator ${lib.Is_Active === 1 ? "active" : "inactive"}`}>
                              {lib.Is_Active === 1 ? "ACTIVE" : "INACTIVE"}
                            </span>
                          </span>
                        </div>

                        <div className="card-header">
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
