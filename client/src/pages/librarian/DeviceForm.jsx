import React, { useState } from "react";
import Header from "../../components/header/LibrarianHeader";
import "./LibrarianPage.css";

const DeviceForm = () => {
  const [formData, setFormData] = useState({
    device_model: "",
    device_category: "",
    device: "",
    device_copy: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.device_model.trim()) newErrors.device_model = "Device model is required";
    if (!formData.device_category.trim()) newErrors.device_category = "Device category is required";
    if (!formData.device.trim()) newErrors.device = "Device is required";
    if (!formData.device_copy.trim()) newErrors.device_copy = "Device copy is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Submit data
    console.log("Submitting device:", formData);
    alert("Device added successfully!");
    setFormData({
      device_model: "",
      device_category: "",
      device: "",
      device_copy: "",
    });
    setErrors({});
  };

  return (
    <div>
      <div className="book-form-container">
        <form onSubmit={handleSubmit}>
          <h2>Add a Device</h2>

          {[
            { label: "Device Model", name: "device_model" },
            { label: "Device Category (Laptop, Camera, Calculator)", name: "device_category" },
            { label: "Device", name: "device" },
            { label: "Device Copy", name: "device_copy" },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="block font-medium">
                {label} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
              {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
            </div>
          ))}

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add Device
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeviceForm;
