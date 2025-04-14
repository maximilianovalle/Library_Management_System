import React, { useState, useEffect } from "react";
import { FaUserTie, FaUsersCog, FaChartPie, FaClipboardList } from "react-icons/fa";
import axios from "axios";
import Header from "../../components/header/ManagerHeader";
import { Link } from "react-router-dom";
import "./ManagerDashboard.css";

const ManagerDashboard = () => {
  const [managerName, setManagerName] = useState("");
  const [totalLibrarians, setTotalLibrarians] = useState(0);
  const [activeLibrarians, setActiveLibrarians] = useState(0);
  const [inactiveLibrarians, setInactiveLibrarians] = useState(0);
  const [recentChanges, setRecentChanges] = useState([]);

  useEffect(() => {
    // const fetchDashboardData = async () => {
    //   try {
    //     const token = localStorage.getItem("token");
    //     if (!token) {
    //       window.location.href = "/login";
    //       return;
    //     }

    //     const res = await axios.get(`${process.env.REACT_APP_API_URL}/manager`, {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     });

    //     const data = res.data;
    //     console.log(data)
    //     setManagerName(data.managerName);
    //     setTotalLibrarians(data.totalLibrarians);
    //     setActiveLibrarians(data.activeLibrarians);
    //     setInactiveLibrarians(data.inactiveLibrarians);
    //     setRecentChanges(data.recentChanges);
    //   } catch (err) {
    //     console.error("Dashboard fetch error:", err);
    //   }
    // };

    // fetchDashboardData();
  }, []);

  return (
    <div className="manager-dashboard">
      <Header />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Manager Dashboard</h1>
          <p>Welcome back, {managerName}</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <FaUsersCog className="icon" />
            <div>
              <h3>Total Librarians</h3>
              <p>{totalLibrarians}</p>
            </div>
          </div>
          <div className="stat-card">
            <FaUserTie className="icon" />
            <div>
              <h3>Active Librarians</h3>
              <p>{activeLibrarians}</p>
            </div>
          </div>
          <div className="stat-card">
            <FaUserTie className="icon inactive" />
            <div>
              <h3>Inactive Librarians</h3>
              <p>{inactiveLibrarians}</p>
            </div>
          </div>
        </div>

        <div className="quick-links">
          <Link to="/view-librarians" className="quick-link">
            <FaClipboardList className="icon" /> View Librarians
          </Link>
          <Link to="/reports" className="quick-link">
            <FaChartPie className="icon" /> View Reports
          </Link>
        </div>

        <div className="activity-log">
          <h2>Recent Updates</h2>
          {recentChanges.length > 0 ? (
            <ul>
              {recentChanges.map((change, index) => (
                <li key={index}>{change}</li>
              ))}
            </ul>
          ) : (
            <p>No recent updates.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
