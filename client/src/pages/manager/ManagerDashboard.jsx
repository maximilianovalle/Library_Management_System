import React, { useState, useEffect } from "react";
import { FaUserTie, FaChartPie, FaClipboardList, FaBookMedical } from "react-icons/fa";
import { TbDeviceDesktopExclamation } from "react-icons/tb";
import axios from "axios";
import Header from "../../components/header/ManagerHeader";
import { Link } from "react-router-dom";
import "./ManagerDashboard.css";

const ManagerDashboard = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [activeLibrarians, setActiveLibrarians] = useState(0);
  // const [recentChanges, setRecentChanges] = useState([]);
  const [maintenanceBooks, setMaintenanceBooks] = useState(0);
  const [maintenanceDevices, setMaintenanceDevices] = useState(0);

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
        setMaintenanceBooks(res.data.maintenanceBooks);
        setMaintenanceDevices(res.data.maintenanceDevices);

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

        {loading ? (
          <div className="dashboard-loading">
              <div className="spinner"></div>
              <p>Loading dashboard data...</p>
          </div>
        ) : (
          <>

            <div className="dashboard-header">
              <h1 id="dashboardTitle" className="dashboard-title">Manager Dashboard</h1>

              <div className="dashboard-welcome">
                <div className="welcome-message">
                  <h2>Welcome back, {firstName} {lastName}</h2>
                  <p>Here's what's happening at your library today</p>
                </div>

                <div className="current-date">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            </div>

            <div className="dashboard-stats-grid">

              <div className="stat-card">
                <div className="stat-icon">
                <FaUserTie/>
                </div>

                <div className="stat-content">
                  <h3>Active Librarians</h3>
                  <p className="stat-value">{activeLibrarians}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                <FaBookMedical />
                </div>

                <div className="stat-content">
                  <h3>Damaged Books</h3>
                  <p className="stat-value">{maintenanceBooks}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                <TbDeviceDesktopExclamation />
                </div>

                <div className="stat-content">
                  <h3>Damaged Devices</h3>
                  <p className="stat-value">{maintenanceDevices}</p>
                </div>
              </div>

            </div>

            <div className="dashboard-content">

              <div className="dashboard-section">

                <div className="section-header">
                  <h2>Quick Actions</h2>
                </div>

                <div id="actionLinks" className="quick-actions">
                  <Link to="/manage-librarians" className="action-button add-book">
                  <FaClipboardList className="icon" />Add Librarian
                  </Link>

                  <Link to="/reports" className="action-button add-device">
                  <FaChartPie className="icon" />View Reports
                  </Link>
                </div>

              </div>

            </div>

          </>
        )}
        </div>
    </div>
  );
};

export default ManagerDashboard;
