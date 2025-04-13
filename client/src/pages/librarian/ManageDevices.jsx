import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/header/LibrarianHeader";
import DeviceForm from "./DeviceForm";
import EditDevice from "./EditDevice";
import "./ManageDevice.css"; // You'll need to create this

const ManageDevices = () => {
  const [activeTab, setActiveTab] = useState("add"); // "add" | "edit" | "delete"
  const [devices, setDevices] = useState([]);
  const [editingDeviceId, setEditingDeviceId] = useState(null);

  useEffect(() => {
    if (activeTab !== "add") {
      axios.get("http://localhost:5000/api/devices")
        .then((res) => setDevices(res.data))
        .catch((err) => console.error(err));
    }
  }, [activeTab]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/devices/${id}`);
      setDevices(devices.filter(device => device.id !== id));
      alert("Device deleted!");
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const resetEdit = () => {
    setEditingDeviceId(null);
    setActiveTab("edit");
  };

  return (
    <div>
      <Header />
      <div className="manage-devices-container">
        <h1 className="title">Manage Devices</h1>

        <div className="button-group">
          <button onClick={() => {
            setActiveTab("add");
            setEditingDeviceId(null);
          }}>Add Device</button>
          <button onClick={() => {
            setActiveTab("edit");
            setEditingDeviceId(null);
          }}>Edit Device</button>
          <button onClick={() => {
            setActiveTab("delete");
            setEditingDeviceId(null);
          }}>Delete Device</button>
        </div>

        <div className="form-section">
          {activeTab === "add" && <DeviceForm />}

          {activeTab === "edit" && (
            <div>
              {editingDeviceId ? (
                <EditDevice deviceId={editingDeviceId} onFinish={resetEdit} />
              ) : (
                <div>
                  <h2>Select a Device to Edit</h2>
                  {devices.map((device) => (
                    <div key={device.id} className="device-row">
                      <span>{device.name} (Serial: {device.serial})</span>
                      <button onClick={() => setEditingDeviceId(device.id)}>
                        Edit
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "delete" && (
            <div>
              <h2>Delete a Device</h2>
              {devices.map((device) => (
                <div key={device.id} className="device-row">
                  <span>{device.name} (Serial: {device.serial})</span>
                  <button className="delete-btn" onClick={() => handleDelete(device.id)}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageDevices;
