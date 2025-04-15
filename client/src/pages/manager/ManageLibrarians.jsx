import React, { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/ManagerHeader";
import "./ManageLibrarians.css";

const ManageLibrarians = () => {
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
  const navigate = useNavigate();

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
        const token = localStorage.getItem("token");
        await axios.post(`${process.env.REACT_APP_API_URL}/add_librarian`, formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        showToast(`${formData.First_Name} ${formData.Last_Name} added successfully!`, "success");
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
    }
  };

  return (
    <div>
      <Header />
      <div id="mainManage">

      <div className="manage-librarians-container container2">
          <h1 id="dashboardTitle" class="manageLibrariansTitle dashboard-title">Create a Librarian Account</h1>

        {/* <div className="button-group">
          <button onClick={() => setActiveTab("add")}>Add Librarian</button>
          <button onClick={() => navigate("/view-librarians")}>View All</button>
        </div> */}
        {/* <h3 class="addLibrarianSubtext">Create a Librarian Account</h3> */}

        <button class="viewAllBtn" onClick={() => navigate("/view-librarians")}><IoIosSearch /> View All Librarians</button>

        {toast.message && (
          <div className={`toast ${toast.type}`}>{toast.message}</div>
        )}

        <div className="form-section">
          {activeTab === "add" && (
            <form onSubmit={handleAdd} className="librarian-form" autoComplete="off">
              {Object.entries(formData).map(([key, value]) => (
                <input
                  key={key}
                  name={key}
                  value={value}
                  onChange={handleChange}
                  placeholder={key.replace(/_/g, ' ')}
                  type={key.toLowerCase().includes("date") ? "date" : "text"}
                  required={key !== "Pay_Rate"}
                />
              ))}
              <button type="submit">Add Librarian</button>
            </form>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default ManageLibrarians;