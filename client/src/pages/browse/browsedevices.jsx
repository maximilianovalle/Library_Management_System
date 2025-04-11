import React, { useState, useEffect } from "react";
import axios from "axios";
import HeaderAfter from "../../components/header/HeaderAfter";
import "./browsedevices.css";
import cameraImg from "../checkedOutItems/camera.png";
import calculatorImg from "../checkedOutItems/calculator.png";
import laptopImg from "../checkedOutItems/laptop.png";

// const browse_by = ["Model", "Category", "Condition", "Status"];
const categoryChips = ["Laptop", "Camera", "Calculator"];

const categoryImages = {
    camera: cameraImg,
    calculator: calculatorImg,
    laptop: laptopImg,
};

const BrowseDevices = () => {
    const [searchValue, setSearchValue] = useState("");
    const [searchBy, setSearchBy] = useState("");
    const [sortBy] = useState("");
    const [devices, setDevices] = useState([]);

    const fetchDevices = async (params = {}) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                window.location.href = "/login";
                return;
            }

            const response = await axios.get(`${process.env.REACT_APP_API_URL}/devices`, {
                headers: { Authorization: `Bearer ${token}` },
                params,
            });

            setDevices(response.data.devices || []);
        } catch (error) {
            console.error("Error fetching devices:", error);
        }
    };

    useEffect(() => {
        fetchDevices({
            search_by: "device_status",
            search_value: "Available"
        });
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchDevices({
            search_by: searchBy,
            search_value: searchValue,
            sort_by: sortBy
        });
    };

    const handleChipClick = (category) => {
        setSearchValue(category);
        setSearchBy("category");
        fetchDevices({
            search_by: "category",
            search_value: category,
            sort_by: sortBy
        });
    };

    const handleHold = (device) => {
        alert(`Hold placed on ${device.model} (${device.category})`);
        // You would send a POST request here to /hold or similar
    };

    return (
        <div>
            <HeaderAfter />

            <div className="search-area">
                {/* <form className="search" onSubmit={handleSearch}>
                    <input
                        className="search_bar"
                        type="text"
                        placeholder="Ex: Dell, Camera, Good condition..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <select
                        className="search_dropdown"
                        value={searchBy}
                        onChange={(e) => setSearchBy(e.target.value.toLowerCase())}
                    >
                        {browse_by.map((option, idx) => (
                            <option key={idx} value={option.toLowerCase()}>{option}</option>
                        ))}
                    </select>
                    <button className="search_button" type="submit">Search</button>
                </form> */}
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
                        {devices.map((device, index) => {
                            const imageSrc = categoryImages[device.category.toLowerCase()];
                            return (
                                <li key={index} className="device_card">
                                    <div className="device_info">
                                        <strong>{device.model}</strong> ({device.category})<br />
                                        Condition: {device.condition}<br />
                                        Status: <span className={`status ${device.status.replace(" ", "-").toLowerCase()}`}>
                                            {device.status}
                                        </span><br />
                                        {device.status.toLowerCase() === "available" && (
                                            <button
                                                className="hold_button"
                                                onClick={() => handleHold(device)}
                                            >
                                                Place on Hold
                                            </button>
                                        )}
                                    </div>
                                    {imageSrc && (
                                        <img
                                            src={imageSrc}
                                            alt={device.category}
                                            className="device_image"
                                        />
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p>No devices found. Try a different search.</p>
                )}
            </div>
        </div>
    );
};

export default BrowseDevices;
