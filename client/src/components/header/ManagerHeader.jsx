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
    {
      title: "Maintenance",
      link: "/maintenance",
      badge: notifCount,
      onClick: handleMaintenanceClick
    },
    { title: "Reports", link: "/reports" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header className="librarian-header">
      <div className="librarian-container">
        <nav className="librarian-nav">
          <div className="librarian-logo">
            <Link to="/manager">
              <img src="/logo.png" alt="Library Logo" />
            </Link>
            <h1>Cougar Library</h1>
          </div>

          <div className="librarian-links">
            {navItems.map((item) => (
              <div key={item.title} onClick={item.onClick || null} style={{ position: "relative" }}>
                <Link
                  to={item.link}
                  className={`librarian-link ${
                    location.pathname.startsWith(item.link) ? "active" : ""
                  }`}
                >
                  {item.title}
                  {item.badge > 0 && (
                    <span className="notif-badge bounce">{item.badge}</span>
                  )}
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
