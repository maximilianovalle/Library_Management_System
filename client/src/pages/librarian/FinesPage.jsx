import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/header/LibrarianHeader";
import "./FinesPage.css";

const ManageFinesPage = () => {
    const [usersWithFines, setUsersWithFines] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFines = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("No token found. Redirecting to login...");
                    window.location.href = "/login";
                    return;
                }

                const response = await axios.get(`${process.env.REACT_APP_API_URL}/get_fines`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                setUsersWithFines(response.data.fines);
            } catch (error) {
                console.error("Error fetching fines:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFines();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const handleClearFine = (user) => {
        alert(`Fine cleared for ${user.Full_Name}`);
        // Add API integration here if needed
    };

    return (
        <div>
            <Header />
            <div className="fines-page">
                <h1>Manage Fines</h1>

                {usersWithFines.length === 0 ? (
                    <p>No users with fines at the moment.</p>
                ) : (
                    <table className="fines-table">
                        <thead>
                            <tr>
                                <th>User Name</th>
                                <th>Fine Amount</th>
                                <th>Reason</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersWithFines.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.User_Name}</td>
                                    <td>${user.Amount.toFixed(2)}</td>
                                    <td>{user.Reason}</td>
                                    <td>
                                        <button
                                            className="clear-button"
                                            onClick={() => handleClearFine(user)}
                                        >
                                            Clear Fine
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

export default ManageFinesPage;
