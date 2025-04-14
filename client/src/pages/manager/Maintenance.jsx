// MaintenancePage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/header/ManagerHeader";
import "./Maintenance.css";

const MaintenancePage = () => {
  const [maintenanceBooks, setMaintenanceBooks] = useState([]);
  const [maintenanceDevices, setMaintenanceDevices] = useState([]);

  useEffect(() => {
    const fetchMaintenanceItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/maintenance-items`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMaintenanceBooks(res.data.books || []);
        setMaintenanceDevices(res.data.devices || []);
      } catch (err) {
        console.error("Error fetching maintenance items:", err);
      }
    };

    fetchMaintenanceItems();
  }, []);

  const handleResolve = async (type, copyId, identifier) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${process.env.REACT_APP_API_URL}/resolve-maintenance`, {
        type,
        copyId,
        identifier,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Refresh list after update
      setMaintenanceBooks((prev) => prev.filter(b => !(b.Copy_ID === copyId && b.ISBN === identifier)));
      setMaintenanceDevices((prev) => prev.filter(d => !(d.Copy_ID === copyId && d.Model === identifier)));
    } catch (err) {
      console.error("Error resolving maintenance:", err);
    }
  };

  return (
    <div>
      <Header />
      <div className="maintenance-container">
        <h1>Maintenance Items</h1>

        <section>
          <h2>Books</h2>
          <div className="card-grid">
            {maintenanceBooks.map((book, i) => (
              <div key={i} className="maintenance-card">
                <p><strong>ISBN:</strong> {book.ISBN}</p>
                <p><strong>Condition:</strong> {book.Book_Condition}</p>
                <button onClick={() => handleResolve("book", book.Copy_ID, book.ISBN)}>
                  Mark as Available
                </button>
              </div>
            ))}
            {maintenanceBooks.length === 0 && <p>No books in maintenance.</p>}
          </div>
        </section>

        <section>
          <h2>Devices</h2>
          <div className="card-grid">
            {maintenanceDevices.map((device, i) => (
              <div key={i} className="maintenance-card">
                <p><strong>Model:</strong> {device.Model}</p>
                <p><strong>Condition:</strong> {device.Device_Condition}</p>
                <button onClick={() => handleResolve("device", device.Copy_ID, device.Model)}>
                  Mark as Available
                </button>
              </div>
            ))}
            {maintenanceDevices.length === 0 && <p>No devices in maintenance.</p>}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MaintenancePage;
