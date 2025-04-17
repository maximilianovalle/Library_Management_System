import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/header/LibrarianHeader";
import DeviceForm from "./DeviceForm";
import "./ManageDevice.css";

const ManageDevices = () => {
  const [activeTab, setActiveTab] = useState("add");
  const [devices, setDevices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [conditionFilter, setConditionFilter] = useState("");  // condition filter state
  const [toast, setToast] = useState({ message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. Redirecting to login...");
      window.location.href = "/login";
      return;
    }

    if (activeTab === "view") {
      axios
        .get(`${process.env.REACT_APP_API_URL}/get_devices`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (Array.isArray(res.data.devices)) {
            setDevices(res.data.devices);
          } else {
            console.error("Unexpected response structure.");
            showToast("Failed to load devices", "error");
          }
        })
        .catch((err) => {
          console.error(err);
          showToast("Error fetching devices", "error");
        });
    }
  }, [activeTab]);

  const handleDelete = async (deviceToDelete) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the device: ${deviceToDelete.Category} - ${deviceToDelete.Model}?`
    );
    if (!confirmDelete) return;
  
    try {
      const token = localStorage.getItem("token");
  
      await axios.delete(`${process.env.REACT_APP_API_URL}/delete_one_device`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          copyID: deviceToDelete.Copy_ID,
          category: deviceToDelete.Category,
          model: deviceToDelete.Model,
        },
      });
  
      setDevices((prevDevices) =>
        prevDevices.filter((device) => device.Copy_ID !== deviceToDelete.Copy_ID)
      );
  
      showToast("Device deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      showToast("Failed to delete device", "error");
    }
  };

  const getConditionClass = (condition) => {
    if (!condition) return "";
    const clean = condition.trim().toLowerCase();
    switch (clean) {
      case "good":
      case "good condition":
        return "good-condition";
      case "bad":
      case "bad condition":
        return "bad-condition";
      case "worn":
      case "worn out":
        return "worn-condition";
      default:
        return "";
    }
  };

  console.log('Current Condition Filter:', conditionFilter);

  const filteredDevices = devices
  .filter((device) => device.Device_Status?.toLowerCase() !== "deleted" || "Checked out") // filter out deleted devices
  .filter((device) => {
    const query = searchQuery.toLowerCase();
    const conditionMatch =
      conditionFilter === "" ||
      (device.Device_Condition || "").toLowerCase().includes(conditionFilter.toLowerCase());

    return (
      ((device.Model || "").toLowerCase().includes(query) ||
        (device.Category || "").toLowerCase().includes(query)) &&
      conditionMatch
    );
  });

  return (
    <div>
      <Header />
      <div className="manage-devices-container">
        <h1 className="title">Manage Devices</h1>

        <div className="button-group">
          <button onClick={() => setActiveTab("add")}>Add Device</button>
          <button onClick={() => setActiveTab("view")}>View All</button>
        </div>

        {toast.message && (
          <div className={`toast ${toast.type}`}>{toast.message}</div>
        )}

        <div className="form-section">
          {activeTab === "add" && <DeviceForm showToast={showToast} />}

          {activeTab === "view" && (
            <div className="device-list">
              <input
                type="text"
                placeholder="Search by category or model..."
                className="search-bar"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {/* Condition Filter Buttons */}
              <div className="condition-filter">
                <button onClick={() => setConditionFilter("")}>All Conditions</button>
                <button onClick={() => setConditionFilter("good")}>Good</button>
                <button onClick={() => setConditionFilter("bad")}>Bad</button>
                <button onClick={() => setConditionFilter("worn")}>Worn Out</button>
              </div>

              {filteredDevices.length === 0 ? (
                <p>No devices found.</p>
              ) : (
                filteredDevices.map((device) => (
                  <div className="device-row">
                    <div>
                      <strong>{device.Category}</strong> — {device.Model}
                      <br />
                      <span
                        className={`condition-tag ${getConditionClass(device.Device_Condition)}`}
                      >
                        {device.Device_Condition}
                      </span>
                    </div>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(device)}
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageDevices;
