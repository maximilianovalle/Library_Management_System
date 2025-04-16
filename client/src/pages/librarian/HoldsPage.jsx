import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/header/LibrarianHeader";
import "./HoldsPage.css";

const HoldsPage = () => {
    const [usersWithHolds, setUsersWithHolds] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const handlePickedUP = async (item) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found. Redirecting to login...");
                window.location.href = "/login";
                return;
            }

            const response = await axios.post(`${process.env.REACT_APP_API_URL}/device_pickup`, {
                hold_id: item.Hold_ID,
                model: item.Model,
                userID: item.User_ID,
                category: item.Category,
                copy_id: item.Copy_ID
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            alert(response.data.message);
            window.location.reload()
        } catch (error) {
            console.error("Error handling picked up:", error);
        }
    };

    const handleReturned = async (item) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found. Redirecting to login...");
                window.location.href = "/login";
                return;
            }

            const response = await axios.post(`${process.env.REACT_APP_API_URL}/returned_device`, {
                model: item.Model,
                userID: item.User_ID,
                category: item.Category,
                copy_id: item.Copy_ID
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            alert(response.data.message);
            window.location.reload()
        } catch (error) {
            console.error("Error handling picked up:", error);
        }
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

    const handleDelete = (indexToRemove) => {
        setUsersWithHolds(prev => {
            const copy = [...prev];
            copy.splice(indexToRemove, 1);
            return copy;
        });
    };

    const renderTable = (title, items, actionType) => (
        <div className="status-section">
            <h2>{title}</h2>
            {items.length === 0 ? (
                <p>No {title.toLowerCase()} holds found.</p>
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
                            {items.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.Holder_Name}</td>
                                    <td>{item.Category}</td>
                                    <td>{item.Model}</td>
                                    <td>{getHoldStatusText(item.Hold_status)}</td>
                                    <td>{item.Hold_ID}</td>
                                    <td>{formatDate(item.Created_at)}</td>
                                    <td>{formatDate(item.Expiration_date)}</td>
                                    <td>
                                        {actionType === "pickup" && (
                                            <button
                                                className="notify-button"
                                                onClick={() => handlePickedUP(item)}
                                            >
                                                Picked Up
                                            </button>
                                        )}
                                        {actionType === "return" && (
                                            <button className="notify-button"
                                            onClick={() => handleReturned(item)}>
                                                Returned
                                            </button>
                                        )}
                                        {actionType === "delete" && (
                                            <button
                                                className="notify-button"
                                                onClick={() => handleDelete(index)}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    const getHoldStatusText = (statusCode) => {
        switch (statusCode) {
            case 1: return "Active";
            case 2: return "Pending";
            case 3: return "Expired";
            default: return "Unknown";
        }
    };

    const activeHolds = usersWithHolds.filter(item => item.Hold_status === 1);
    const pendingHolds = usersWithHolds.filter(item => item.Hold_status === 2);
    const expiredHolds = usersWithHolds.filter(item => item.Hold_status === 3);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Header />
            <div className="holds-page">
                <h1>Manage Holds</h1>
                {renderTable("Pending Holds", pendingHolds, "pickup")}
                {renderTable("Active Holds", activeHolds, "return")}
                {renderTable("Expired Holds", expiredHolds, "delete")}
            </div>
        </div>
    );
};

export default HoldsPage;
