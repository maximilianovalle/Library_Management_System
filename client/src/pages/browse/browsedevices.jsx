import React, { useState } from "react";
import axios from "axios";
import DropDown from './components/drop_down';
import HeaderAfter from "../../components/header/HeaderAfter";
import './browsedevices.css';

const browse_by = ["Model", "Category", "Condition", "Status"];

const BrowseDevices = () => {
    const [searchValue, setSearchValue] = useState("");
    const [searchBy, setSearchBy] = useState("");
    const [devices, setDevices] = useState([]);

    const handleSelect = (selectedOption) => {
        setSearchBy(selectedOption.toLowerCase()); // match backend field names
    };

    const fetchDevices = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No token found. Redirecting to login...");
                window.location.href = "/login";
                return;
            }

            const response = await axios.get("http://localhost:8000/devices", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                params: {
                    search_value: searchValue,
                    search_by: searchBy,
                }
            });

            setDevices(response.data);
        } catch (error) {
            console.error("Error fetching devices:", error);
        }
    };

    return (
        <div id="body">
            <HeaderAfter />

            <div className="search-container">
                <form className="search" onSubmit={fetchDevices}>
                    <input
                        className="search_bar"
                        type="text"
                        placeholder="Search for devices..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <button className="search_button" type="submit">Search</button>
                </form>

                <DropDown options={browse_by} onSelect={handleSelect} />
            </div>

            <div className="Display_container">
                {devices.length > 0 ? (
                    <ul className="device_list">
                        {devices.map((device, index) => (
                            <li key={index} className="device_card">
                                <strong>{device.model}</strong> ({device.category})<br />
                                Condition: {device.condition} <br />
                                Status: <span className={`status ${device.status.replace(" ", "-").toLowerCase()}`}>
                                    {device.status}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No devices found. Try searching above.</p>
                )}
            </div>
        </div>
    );
};

export default BrowseDevices;
