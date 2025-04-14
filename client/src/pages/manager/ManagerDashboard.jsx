import React, { useState, useEffect } from "react";
import { FaUserTie, FaUsersCog, FaChartPie, FaClipboardList } from "react-icons/fa";
import axios from "axios";
import Header from "../../components/header/ManagerHeader";
import { Link } from "react-router-dom";
import "./ManagerDashboard.css";

const ManagerDashboard = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [activeLibrarians, setActiveLibrarians] = useState(0);
  const [recentChanges, setRecentChanges] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");    // retrieve token from frontend localStorage

        // if ( no token )
        if (!token) {
            console.error("No token found. Redirecting to login...");
            window.location.href = "/login";
            return;
        }

        const res = await axios.get(`${process.env.REACT_APP_API_URL}/manager`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        setFirstName(res.data.firstName);
        setLastName(res.data.lastName);
        setActiveLibrarians(res.data.activeLibrarians);

      } catch (error) {
        console.error("Error fetching dashboard data: ", error);
      }
    }

    fetchDashboardData();

  }, []);


  // HTML
  return (
    <div className="manager-dashboard">

      <Header />

      <div className="dashboard-container">

        <h1>Manager Dashboard</h1>

        <div class="dashboard-welcome">
          <div className="welcome-message">
            <h2>Welcome back, {firstName} {lastName}</h2>
            <p>Here's what's happening at your library today</p>
          </div>

          <div className="current-date">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        <div class="dashboard-stats-grid">

          <div className="stat-card">
            <FaUserTie className="stat-icon" />

            <div class="stat-content">
              <h3>Active Librarians</h3>
              <p class="stat-value">{activeLibrarians}</p>
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
