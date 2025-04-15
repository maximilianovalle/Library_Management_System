import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "./ManagerHeader.css";

const ManagerHeader = () => {
  const location = useLocation();
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    const fetchNotifCount = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/maintenance-notifications/unread`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifCount(res.data.count || 0);
      } catch (err) {
        console.error("Failed to fetch unread maintenance notifications:", err);
      }
    };

    fetchNotifCount();
  }, []);

  const handleMaintenanceClick = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${process.env.REACT_APP_API_URL}/maintenance-notifications/mark-read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifCount(0);
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    }
  };

  const navItems = [
    { title: "Dashboard", link: "/manager" },
    { title: "Manage Librarians", link: "/manage-librarians" },
    { title: "Manage Catalogue", link: "/deleteItems" },
    {
      title: "Maintenance",
      link: "/maintenance",
      badge: notifCount,
      onClick: handleMaintenanceClick,
    },
    { title: "Reports", link: "/reports" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header className="manager-header">
      <div className="manager-container">
        <nav className="manager-nav">
          <div className="manager-logo">
            <Link to="/manager">
              <img src="/logo.png" alt="Library Logo" />
            </Link>
            <h1>Cougar Library</h1>
          </div>

          <div className="manager-links">
            {navItems.map((item) => (
              <div key={item.title} onClick={item.onClick || null} className="manager-link-wrapper">
                <Link
                  to={item.link}
                  className={`manager-link ${
                    location.pathname.startsWith(item.link) ? "active" : ""
                  }`}
                >
                  {item.title}
                  {item.badge > 0 && <span className="notif-badge">{item.badge}</span>}
                </Link>
              </div>
            ))}
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default ManagerHeader;
