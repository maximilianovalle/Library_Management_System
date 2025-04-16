import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/header/LibrarianHeader";
import "./FinesPage.css";

const ManageFinesPage = () => {
    const [usersWithFines, setUsersWithFines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newFineAmount, setNewFineAmount] = useState("");
    const [showActiveOnly, setShowActiveOnly] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

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

    const openModal = (user) => {
        setSelectedUser(user);
        setNewFineAmount(user.Amount);
        setIsModalOpen(true);
        setSuccessMessage("");
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSuccessMessage("");
    };

    const handleSaveFine = async () => {
        if (isNaN(newFineAmount) || newFineAmount < 0) {
            alert("Please enter a valid non-negative number.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await axios.post(`${process.env.REACT_APP_API_URL}/update_fine`, {
                user_id: selectedUser.User_ID,
                new_amount: parseFloat(newFineAmount),
                record_id: selectedUser.Record_ID
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            setUsersWithFines(prev =>
                prev.map(u => u.User_ID === selectedUser.User_ID
                    ? { ...u, Amount: newFineAmount }
                    : u
                )
            );

            setSuccessMessage(`Fine updated successfully for ${selectedUser.User_Name}.`);
        } catch (error) {
            console.error("Error updating fine:", error);
            alert("Failed to update fine.");
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

    if (loading) {
        return <div>Loading...</div>;
    }

    const finesToDisplay = showActiveOnly
        ? usersWithFines.filter(user => user.Fine_Status === 2) // Show only unpaid fines
        : usersWithFines;

    return (
        <div>
            <Header />
            <div className="fines-page">
                <h1>Manage Fines</h1>

                <button
                    className="filter-button"
                    onClick={() => setShowActiveOnly(prev => !prev)}
                >
                    {showActiveOnly ? "Show All Fines" : "Show Only Unpaid Fines"}
                </button>

                {finesToDisplay.length === 0 ? (
                    <p>{showActiveOnly ? "No unpaid fines at the moment." : "No fines at the moment."}</p>
                ) : (
                    <div className="table-container">
                        <table className="fines-table">
                            <thead>
                                <tr>
                                    <th>User Name</th>
                                    <th>Fine Amount</th>
                                    <th>Reason</th>
                                    <th>Record ID</th>
                                    <th>Fine Status</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {finesToDisplay.map((user, index) => (
                                    <tr key={index}>
                                        <td>{user.User_Name}</td>
                                        <td>{user.Amount}</td>
                                        <td>{user.Reason}</td>
                                        <td>{user.Record_ID}</td>
                                        <td>{user.Fine_Status === 1 ? 'Paid' : 'Unpaid'}</td>
                                        <td>{formatDate(user.Created_at)}</td>
                                        <td>
                                            <button
                                                className="clear-button"
                                                onClick={() => openModal(user)}
                                            >
                                                Update
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <span className="modal-close" onClick={closeModal}>×</span>
                        <h2>Update Fine</h2>

                        {successMessage ? (
                            <p className="success-message">{successMessage}</p>
                        ) : (
                            <>
                                <label>New Fine Amount:</label>
                                <input
                                    type="number"
                                    value={newFineAmount}
                                    min="0"
                                    step="0.01"
                                    onChange={(e) => setNewFineAmount(e.target.value)}
                                />
                                <div className="modal-actions">
                                    <button onClick={closeModal}>Cancel</button>
                                    <button onClick={handleSaveFine}>Save</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageFinesPage;
