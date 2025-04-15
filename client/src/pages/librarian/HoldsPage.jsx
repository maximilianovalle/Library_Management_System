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

    if (loading) {
        return <div>Loading...</div>;
    }

    const handleNotify = (item) => {
        // Placeholder logic – you can add API integration here
        alert(`Notification sent to ${item.Holder_Name}`);
    };

    return (
        <div>
            <Header />
            <div className="holds-page">
            <h1>Manage Holds</h1>
            <h2>Users with Holds</h2>

            {usersWithHolds.length === 0 ? (
                <p>No users with holds at the moment.</p>
            ) : (
                <table className="holds-table">
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Category</th>
                            <th>Model</th>
                            <th>Actions</th> {/* New column */}
                        </tr>
                    </thead>
                    <tbody>
                        {usersWithHolds.map((item, index) => (
                            <tr key={index}>
                                <td>{item.Holder_Name}</td>
                                <td>{item.Category}</td>
                                <td>{item.Model}</td>
                                <td>
                                    <button
                                        className="notify-button"
                                        onClick={() => handleNotify(item)}
                                    >
                                        Notify
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            </div>
        </div>
    );
};

export default HoldsPage;
