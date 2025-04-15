import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/header/ManagerHeader";
import "./Maintenance.css";

import cameraImg from "../checkedOutItems/camera.png";
import calculatorImg from "../checkedOutItems/calculator.png";
import laptopImg from "../checkedOutItems/laptop.png";
import defaultCover from "../browse/book-not-found.png";

const categoryImages = {
  camera: cameraImg,
  calculator: calculatorImg,
  laptop: laptopImg,
};

const MaintenancePage = () => {
  const [maintenanceBooks, setMaintenanceBooks] = useState([]);
  const [maintenanceDevices, setMaintenanceDevices] = useState([]);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
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
        <h1 className="title">Maintenance Center</h1>

        {loading ? (
          <div className="spinner"></div>
        ) : (
          <>
            <div className="maintenance-section">
              <h2>Books</h2>
              <div className="maintenance-grid">
                {maintenanceBooks.map((book, i) => (
                  <div key={i} className="maintenance-card">
                    <div className="device-card-top">
                      <div>
                        <h3>{book.Title || "Untitled Book"}</h3>
                        <p><strong>ISBN:</strong> {book.ISBN}</p>
                        <p><strong>Condition:</strong> {book.Book_Condition}</p>
                      </div>
                      <img
                        src={`https://covers.openlibrary.org/b/isbn/${book.ISBN}-L.jpg?default=false`}
                        alt={book.Title || book.ISBN}
                        className="device-img"
                        onError={(e) => {
                          if (e.target.src !== defaultCover) {
                            e.target.onerror = null;
                            e.target.src = defaultCover;
                          }
                        }}
                      />
                    </div>
                    <button onClick={() => handleResolve("book", book.Copy_ID, book.ISBN)}>
                      Mark as Available
                    </button>
                  </div>
                ))}
                {maintenanceBooks.length === 0 && <p>No books in maintenance.</p>}
              </div>
            </div>

            <div className="maintenance-section">
              <h2>Devices</h2>
              <div className="maintenance-grid">
                {maintenanceDevices.map((device, i) => {
                  const image = categoryImages[(device.Category || "").toLowerCase()];
                  return (
                    <div key={i} className="maintenance-card">
                      <div className="device-card-top">
                        <div>
                          <p><strong>Model:</strong> {device.Model}</p>
                          <p><strong>Condition:</strong> {device.Device_Condition}</p>
                        </div>
                        {image && <img src={image} alt={device.Category} className="device-img" />}
                      </div>
                      <button onClick={() => handleResolve("device", device.Copy_ID, device.Model)}>
                        Mark as Available
                      </button>
                    </div>
                  );
                })}
                {maintenanceDevices.length === 0 && <p>No devices in maintenance.</p>}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MaintenancePage;
