import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/header/LibrarianHeader";
import "./HoldsPage.css";

const HoldsPage = () => {
    const [usersWithHolds, setUsersWithHolds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        const fetchHolds = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("No token found. Redirecting to login...");
                    window.location.href = "/login";
                    return;
                }

                const response = await axios.get(`${process.env.REACT_APP_API_URL}/get_holds`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                setUsersWithHolds(response.data.heldItems);
            } catch (error) {
                console.error("Error fetching holds:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHolds();
    }, []);

    const handleNotify = (item) => {
        alert(`Notification sent to ${item.Holder_Name}`);
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getHoldStatusText = (statusCode) => {
        switch (statusCode) {
            case 1: return "Active";
            case 2: return "Pending";
            case 3: return "Expired";
            default: return "Unknown";
        }
    };

    const filteredHolds = usersWithHolds.filter(item => {
        if (filterStatus === "all") return true;
        if (filterStatus === "active") return item.Hold_status === 1;
        if (filterStatus === "pending") return item.Hold_status === 2;
        if (filterStatus === "expired") return item.Hold_status === 3;
        return true;
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Header />
            <div className="holds-page">
                <h1>Manage Holds</h1>
                <div className="filter-section">
                    <label htmlFor="filterSelect">Filter by Status:</label>
                    <select
                        id="filterSelect"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="expired">Expired</option>
                    </select>
                </div>

                {filteredHolds.length === 0 ? (
                    <p>No holds matching the selected filter.</p>
                ) : (
                    <div className="table-container">
                        <table className="holds-table">
                            <thead>
                                <tr>
                                    <th>User Name</th>
                                    <th>Category</th>
                                    <th>Model</th>
                                    <th>Status</th>
                                    <th>Hold ID</th>
                                    <th>Created At</th>
                                    <th>Expiration Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredHolds.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.Holder_Name}</td>
                                        <td>{item.Category}</td>
                                        <td>{item.Model}</td>
                                        <td>{getHoldStatusText(item.Hold_status)}</td>
                                        <td>{item.Hold_ID}</td>
                                        <td>{formatDate(item.Created_at)}</td>
                                        <td>{formatDate(item.Expiration_date)}</td>
                                        <td>
                                            <button
                                                className="notify-button"
                                                onClick={() => handleNotify(item)}
                                            >
                                                Picked Up
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HoldsPage;
