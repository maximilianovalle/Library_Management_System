import React, { useState } from "react";
import axios from "axios";
import "./BookForm.css"; // Reuse BookForm styles for consistency

const DeviceForm = () => {
  const [deviceModel, setDeviceModel] = useState("");
  const [deviceCategory, setDeviceCategory] = useState("");
  const [deviceCopy, setDeviceCopy] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!deviceModel.trim()) newErrors.deviceModel = "Device model is required";
    if (!deviceCategory.trim()) newErrors.deviceCategory = "Device category is required";
    if (!deviceCopy.trim()) newErrors.deviceCopy = "Device copy is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const deviceData = {
      device_model: deviceModel,
      device_category: deviceCategory,
      device_copy: deviceCopy,
    };
    console.log(deviceData)

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found. Redirecting to login...");
        window.location.href = "/login";
        return;
      }

      const res = await axios.post(`${process.env.REACT_APP_API_URL}/adddevice`, deviceData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.error) {
        console.error("Error adding device:", res.data.error);
        alert("Failed to add device. Please try again.");
        return;
      }

      alert("Device added successfully!");
      window.location.href = "/librarian";

      // Reset form
      setDeviceModel("");
      setDeviceCategory("");
      setDeviceCopy("");
      setErrors({});
    } catch (error) {
      console.error("Error submitting device:", error);
      alert("Failed to add device. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-form-page">
      <div className="book-form-container">
        <h2>Add a Device</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Device Model<span className="required-star">*</span>
            </label>
            <input
              type="text"
              value={deviceModel}
              onChange={(e) => setDeviceModel(e.target.value)}
            />
            {errors.deviceModel && <p className="text-error">{errors.deviceModel}</p>}
          </div>

          <div>
            <label>
              Device Category<span className="required-star">*</span>
            </label>
            <input
              type="text"
              placeholder="Laptop, Camera, Calculator, etc."
              value={deviceCategory}
              onChange={(e) => setDeviceCategory(e.target.value)}
            />
            {errors.deviceCategory && <p className="text-error">{errors.deviceCategory}</p>}
          </div>


          <div>
            <label>
              Number of Copies<span className="required-star">*</span>
            </label>
            <input type="number" value={deviceCopy} onChange={(e) => setDeviceCopy(e.target.value)} />
            {errors.deviceCopy && <p className="text-error">{errors.deviceCopy}</p>}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Device"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeviceForm;
