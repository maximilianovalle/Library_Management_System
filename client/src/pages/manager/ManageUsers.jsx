import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoIosSearch, IoIosAdd } from "react-icons/io";
import { MdOutlineModeEdit, MdDelete, MdVisibility, MdVisibilityOff } from "react-icons/md";
import Header from "../../components/header/ManagerHeader";
import "./ManageLibrarians.css"; // Reused styling

// Helper function to generate random passwords
const generateRandomPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=";
    return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  };

    const roleMap = {
    1: "Student",
    2: "Alumni",
    3: "Faculty",
  };  
  
  const ManageUsers = () => {
    const [activeTab, setActiveTab] = useState("add");
    const [formData, setFormData] = useState({
      First_Name: "",
      Last_Name: "",
      Email: "",
      Password: "",
      Role: "1"
    });
    const [showPassword, setShowPassword] = useState(false);
    const [toast, setToast] = useState({ message: "", type: "" });
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(users.length / usersPerPage);
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
    }

    // const handlePageChange = (pageNumber) => {
    // setCurrentPage(pageNumber);
    // };
  
    useEffect(() => {
      if (activeTab === "view") fetchUsers();
    }, [activeTab]);
  
    const showToast = (message, type = "success") => {
      setToast({ message, type });
      setTimeout(() => setToast({ message: "", type: "" }), 3000);
    };
  
    const handleChange = (e) => {
      setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
  
    const handleGeneratePassword = () => {
      const newPassword = generateRandomPassword();
      setFormData(prev => ({
        ...prev,
        Password: newPassword
      }));
    };
  
    const handleAdd = async (e) => {
      e.preventDefault();
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        await axios.post(`${process.env.REACT_APP_API_URL}/add_user`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showToast(`Added ${formData.First_Name} ${formData.Last_Name}`);
        setFormData({ First_Name: "", Last_Name: "", Email: "", Password: "", Role: "1" });
        setShowPassword(false);
      } catch (error) {
        console.error(error);
        showToast("Failed to add user", "error");
      } finally {
        setLoading(false);
      }
    };
  
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/view_user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    };
  
    const handleEdit = (user) => {
      setEditingId(user.User_ID);
      setFormData({ ...user });
    };
  
    const handleUpdate = async (e) => {
      e.preventDefault();
      try {
        const token = localStorage.getItem("token");
        await axios.put(`${process.env.REACT_APP_API_URL}/update_user/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showToast("User updated!");
        setEditingId(null);
        fetchUsers();
      } catch (error) {
        showToast("Update failed", "error");
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
        showToast("User deleted", "error");
        fetchUsers();
        setShowModal(false);
      } catch (error) {
        showToast("Failed to delete", "error");
      }
    };
  
    return (
      <div>
        <Header />
        <div className="manage-librarians-container mainManage">
          <h2 id="dashboardTitle" className="dashboard-title manageLibrariansTitle">Manage Users</h2>
  
          <div className="tab-buttons dashboard-header dashboard-title">
            <button
              className={`tab-button ${activeTab === "add" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("add");
                setEditingId(null);
                setFormData({ First_Name: "", Last_Name: "", Email: "", Password: "", Role: "1" });
                setShowPassword(false);
              }}
            >
              <IoIosAdd /> Add User
            </button>
  
            <button
              className={`tab-button ${activeTab === "view" ? "active" : ""}`}
              onClick={() => setActiveTab("view")}
            >
              <IoIosSearch /> View All Users
            </button>
          </div>
  
          {toast.message && <div className={`toast ${toast.type}`}>{toast.message}</div>}
  
          {activeTab === "add" && (
            <div className="form-section">
              <form onSubmit={handleAdd} className="librarian-form" autoComplete="off">
                <input name="First_Name" value={formData.First_Name} onChange={handleChange} placeholder="First Name" required autoComplete="off"/>
                <input name="Last_Name" value={formData.Last_Name} onChange={handleChange} placeholder="Last Name" required autoComplete="off"/>
                <input name="Email" value={formData.Email} onChange={handleChange} placeholder="Email" type="email" required autoComplete="off"/>
                
                <div className="password-input-container">
                  <input 
                    name="Password" 
                    value={formData.Password} 
                    onChange={handleChange} 
                    placeholder="Password" 
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
                
                <select name="Role" value={formData.Role} onChange={handleChange} className="styled-select">
                  <option value="1">Student</option>
                  <option value="2">Alumni</option>
                  <option value="3">Faculty</option>
                </select>
                <button type="submit" disabled={loading}>
                  {loading ? <div className="spinner"></div> : "Add User"}
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
                    <h2 className="modalHeader">Delete user?</h2>
                    <p>This action cannot be undone.</p>
                    <button className="confirm-btn" onClick={handleDelete}>Yes, Delete</button>
                    <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                  </div>
                </div>
              )}
  
              {editingId ? (
                <div className="edit-modal">
                  <button className="close-btn" onClick={() => setEditingId(null)}>×</button>
                  <form onSubmit={handleUpdate} className="librarian-form">
                      <input name="User_ID" value={formData.User_ID} disabled placeholder="User ID" />
                      <input name="First_Name" value={formData.First_Name} onChange={handleChange} placeholder="First Name" required />
                      <input name="Last_Name" value={formData.Last_Name} onChange={handleChange} placeholder="Last Name" required />
                      <input name="Email" value={formData.Email} onChange={handleChange} placeholder="Email" type="email" required />
                      <div className="password-input-container">
                        <input 
                          name="Password" 
                          value={formData.Password || ""} 
                          onChange={handleChange} 
                          placeholder="Password" 
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
                      <button type="submit">Update User</button>
                  </form>
                </div>
              ) : (
                <div id="containsAllLibrarians">
                {currentUsers.map((user, idx) => (
                <div key={idx} className="librarian-row">
                    <div id="librarianRowSpacing">
                    <div className="card-header">
                        <h3 className="libName entryElement">{user.First_Name} {user.Last_Name}</h3>
                        <span className="position-badge">{roleMap[user.Role]}</span>
                    </div>
                    <div className="card-header">
                        <span className="entryElement">{user.Email}</span>
                        <span className="entryElement">
                        Created: {new Date(user.Created_At).toLocaleDateString("en-US")}
                        </span>
                    </div>
                    </div>
                    <div className="actions">
                    <button className="edit-btn" onClick={() => handleEdit(user)}><MdOutlineModeEdit /> Edit</button>
                    <button className="delete-btn" onClick={() => confirmDelete(user.User_ID)}><MdDelete /> Delete</button>
                    </div>
                </div>
                ))}
                </div>
              )}
              <div className="pagination">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                >
                    &#8592;
                </button>
                <span>
                    {currentPage} of {totalPages}
                </span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                    &#8594;
                </button>
                </div>
            </>
          )}
        </div>
      </div>
    );
  };

export default ManageUsers;
