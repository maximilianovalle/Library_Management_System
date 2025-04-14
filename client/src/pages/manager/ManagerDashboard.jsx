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

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");    // retrieve token from frontend localStorage

        // if ( no token )
        if (!token) {
            console.error("No token found. Redirecting to login...");
            window.location.href = "/login";
            return;
        }

        setTimeout(() => {
          setLoading(false);
      }, 1000);

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
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();

  }, []);


  // HTML
  return (
    <div className="manager-dashboard">

      <Header />

      <div className="dashboard-container">

        {/* <div class="dashboard-header">
          <h1 class="dashboard-title">Manager Dashboard</h1>

          <div class="dashboard-welcome">
            <div className="welcome-message">
              <h2>Welcome back, {firstName} {lastName}</h2>
              <p>Here's what's happening at your library today</p>
            </div>

            <div className="current-date">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div> */}

        {loading ? (
          <div className="dashboard-loading">
              <div className="spinner"></div>
              <p>Loading dashboard data...</p>
          </div>
        ) : (
          <>

            <div class="dashboard-header">
              <h1 id="dashboardTitle" class="dashboard-title">Manager Dashboard</h1>

              <div class="dashboard-welcome">
                <div className="welcome-message">
                  <h2>Welcome back, {firstName} {lastName}</h2>
                  <p>Here's what's happening at your library today</p>
                </div>

                <div className="current-date">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            </div>

            <div class="dashboard-stats-grid">

              <div className="stat-card">
                <div class="stat-icon">
                <FaUserTie/>
                </div>

                <div class="stat-content">
                  <h3>Active Librarians</h3>
                  <p class="stat-value">{activeLibrarians}</p>
                </div>
              </div>

            </div>

            <div class="dashboard-content">

              <div class="dashboard-section">

                <div className="section-header">
                  <h2>Quick Actions</h2>
                </div>

                <div id="actionLinks" class="quick-actions">
                  <Link to="/view-librarians" className="action-button add-book">
                  <FaClipboardList className="icon" />View Librarians
                  </Link>

                  <Link to="/reports" className="action-button add-device">
                  <FaChartPie className="icon" />View Reports
                  </Link>
                </div>

              </div>

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

          </>
        )}
        </div>
    </div>
  );
};

export default ManagerDashboard;
