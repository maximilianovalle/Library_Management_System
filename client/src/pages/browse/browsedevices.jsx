import React, { useState, useEffect } from "react";
import axios from "axios";
import HeaderAfter from "../../components/header/HeaderAfter";
import "./browsedevices.css";

const browse_by = ["Model", "Category", "Condition", "Status"];
const sort_options = ["Model A-Z", "Model Z-A", "Available First", "Unavailable First"];
const categoryChips = ["Laptop", "Camera", "Calculator"];

const BrowseDevices = () => {
    const [search_value, setSearchValue] = useState("");
    const [search_by, setSearchBy] = useState("");
    const [sort_by, setSortBy] = useState("");
    const [devices, setDevices] = useState([]);

    // Helper to fetch from backend
    const fetchDevices = async (params = {}) => {
        console.log("🔍 Fetching Devices With:", params);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found. Redirecting to login...");
                window.location.href = "/login";
                return;
            }

            const response = await axios.get("https://library-management-system-gf9d.onrender.com/devices", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params,
            });

            console.log("✅ Devices returned:", response.data);
            setDevices(response.data.devices || []);
        } catch (error) {
            console.error("❌ Error fetching devices:", error);
        }
    };

    // Run once on page load: show available devices
    useEffect(() => {
        fetchDevices({
            search_by: "device_status",
            search_value: "Available"
        });
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        fetchDevices({
            search_by,
            search_value,
            sort_by
        });
    };

    const handleChipClick = (category) => {
        setSearchValue(category);
        setSearchBy("category");
        fetchDevices({
            search_by: "category",
            search_value: category,
            sort_by
        });
    };

    return (
        <div id="body">
            <HeaderAfter />

            <div className="search-area">
                <form className="search" onSubmit={handleSearch}>
                    <input
                        className="search_bar"
                        type="text"
                        placeholder="Ex: Dell, Camera, Good condition..."
                        value={search_value}
                        onChange={(e) => {
                            setSearchValue(e.target.value);
                            console.log("✏️ Typing:", e.target.value);
                        }}
                    />
                    <select
                        className="search_dropdown"
                        value={search_by}
                        onChange={(e) => setSearchBy(e.target.value.toLowerCase())}
                    >
                        <option value="">Filter By</option>
                        {browse_by.map((option, idx) => (
                            <option key={idx} value={option.toLowerCase()}>
                                {option}
                            </option>
                        ))}
                    </select>
                    <select
                        className="search_dropdown"
                        value={sort_by}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="">Sort By</option>
                        {sort_options.map((option, idx) => (
                            <option key={idx} value={option}>{option}</option>
                        ))}
                    </select>
                    <button className="search_button" type="submit">Search</button>
                </form>
            </div>

            <div className="filters">
                <p>Quick Category Filters:</p>
                {categoryChips.map((category) => (
                    <button
                        key={category}
                        onClick={() => handleChipClick(category)}
                        className="chip"
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="Display_container">
                {devices.length > 0 ? (
                    <ul className="device_list">
                        {devices.map((device, index) => (
                            <li key={index} className="device_card">
                                <strong>{device.model}</strong> ({device.category})<br />
                                Condition: {device.condition}<br />
                                Status: <span className={`status ${device.status.replace(" ", "-").toLowerCase()}`}>
                                    {device.status}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No devices found. Try a different search.</p>
                )}
            </div>
        </div>
    );
};

export default BrowseDevices;
