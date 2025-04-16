import React, { useState, useEffect } from "react";
import axios from "axios";
import HeaderAfter from "../../components/header/HeaderAfter";
import "./browsedevices.css";
import cameraImg from "../checkedOutItems/camera.png";
import calculatorImg from "../checkedOutItems/calculator.png";
import laptopImg from "../checkedOutItems/laptop.png";

const categoryChips = ["Laptop", "Camera", "Calculator"];

const categoryImages = {
    camera: cameraImg,
    calculator: calculatorImg,
    laptop: laptopImg,
};

const BrowseDevices = () => {
    const [searchValue, setSearchValue] = useState("");
    const [searchBy, setSearchBy] = useState("model");
    const [sortBy] = useState("");
    const [devices, setDevices] = useState([]);
    const [userHolds, setUserHolds] = useState([]);
    const [showOnlyHeld, setShowOnlyHeld] = useState(false);
    const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

    const [holdConfirm, setHoldConfirm] = useState(null)

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

    const fetchUserHolds = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/holds`, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            setUserHolds(response.data.holds || []);
        } catch (error) {
            console.error("Error fetching user holds:", error);
        }
    };
    

    useEffect(() => {
        const init = async () => {
            await fetchDevices({ search_by: "device_status", search_value: "Available" });
            await fetchUserHolds();
        };
        init();
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

    const handleHold = async (device) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/hold`, {
                model: device.model,
                category: device.category
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                // alert(`Hold placed on ${device.model} (${device.category})!`);
                setHoldConfirm(device.model);

                await fetchDevices();
                await fetchUserHolds();
            }

        } catch (err) {
            alert(err.response?.data?.message || "Hold failed.");
            setHoldConfirm(null);
        }
    };

    // const closeModal = () => {
    //     setHoldConfirm(null);
    // }

    // const handleCancelHold = async (model) => {
    //     try {
    //         const token = localStorage.getItem("token");
    //         await axios.post(`${process.env.REACT_APP_API_URL}/hold/cancel`, {
    //             model
    //         }, {
    //             headers: { Authorization: `Bearer ${token}` }
    //         });
    //         await fetchDevices();
    //         await fetchUserHolds();
    //         alert("Hold released.");
    //     } catch (err) {
    //         alert("Failed to cancel hold.");
    //     }
    // };

    const filteredDevices = devices.filter(device => {
        const isHeld = userHolds.includes(device.model);
        const isAvailable = device.status.toLowerCase() === "available";
    
        if (showOnlyHeld) return isHeld;
        if (showOnlyAvailable) return isAvailable;
        return true; // Show all if none are checked
    });
    
    

    return (
        <div>
            <HeaderAfter />

            <div id="devicesMainBody">

            <div className="search-area">
                <form className="search" onSubmit={handleSearch}>

                    {/* <select id="searchDropdown" className="search_dropdown" value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
                        {browse_by.map((option, idx) => (
                            <option key={idx} value={option.toLowerCase()}>{option}</option>
                        ))}
                    </select> */}

                    <input
                    className="search_bar"
                    type="text"
                    placeholder="Search Device..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    />

                    <button className="search_button" type="submit">Enter</button>

                </form>
            </div>

            <div className="filters">
                <p>Filter By:</p>
                {categoryChips.map((category) => (
                    <button key={category} onClick={() => handleChipClick(category)} className="chip">{category}</button>
                ))}

                {/* <label className="toggle_held">
                    <input type="checkbox" checked={showOnlyHeld} onChange={(e) => {
                        const checked = e.target.checked;
                        setShowOnlyHeld(checked);
                        if (checked) setShowOnlyAvailable(false);
                    }}/>
                    Show only held devices
                </label> */}

                <label className="toggle_available">
                    <input type="checkbox" checked={showOnlyAvailable} onChange={(e) => {
                        const checked = e.target.checked;
                        setShowOnlyAvailable(checked);
                        if (checked) setShowOnlyHeld(false);
                    }}/>
                    Show only available devices
                </label>
            </div>


            <div className="Display_container">
                {filteredDevices.length > 0 ? (
                    <ul className="device_list">
                        {filteredDevices.map((device, index) => {
                            const imageSrc = categoryImages[device.category.toLowerCase()];
                            const isHeldByUser = userHolds.some(
                                (h) =>
                                    h.model === device.model &&
                                    h.category === device.category &&
                                    h.copy_id === device.copy_id
                            );
                            

                            return (
                                <li key={index} className="device_card">
                                    <div className="device_info">
                                        <p class="entryElement"><strong>{device.model}</strong> ({device.category})</p>
                                        <p class="entryElement">{device.condition}</p>
                                        <span className={`status ${device.status.replace(" ", "-").toLowerCase()}`}>
                                            {device.status}
                                        </span>

                                        {isHeldByUser ? (
                                            <div className="held-section">
                                                <span className="held_by_you">Held by you</span>
                                                {/* <button
                                                    className="cancel_hold_button"
                                                    onClick={() => handleCancelHold(device.model)}
                                                >
                                                    Release Hold
                                                </button> */}
                                            </div>
                                        ) : device.status.toLowerCase() === "available" && (
                                            <button
                                                className="hold_button"
                                                onClick={() => handleHold(device)}
                                            >
                                                Place a Hold
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

            {holdConfirm && (
                <div className="modal-overlay" onClick={() => setHoldConfirm(null)}>

                <div className="modal-box">
                    <span className="modal-close" onClick={() => setHoldConfirm(null)}>&times;</span>
                        
                    <h2 class="modalHeader">On Hold</h2>

                        <p>Device will be added to your held items.</p>

                        <div className="modal-buttons">
                            <button className="confirm-button" onClick={() => setHoldConfirm(null)}>Ok</button>
                        </div>
                    </div>
                    </div>
            )}
        </div>

    );
};

export default BrowseDevices;
