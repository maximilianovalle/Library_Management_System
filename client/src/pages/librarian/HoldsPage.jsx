import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/header/LibrarianHeader";
import "./LibrarianPage.css";

const HoldsPage = () => {
    const [holds, setHolds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchHolds();
    }, []);

    const fetchHolds = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("https://library-management-system-8ktv.onrender.com/librarian/holds", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            setHolds(response.data.holds || []);
        } catch (err) {
            console.error("Failed to fetch holds", err);
            setError("Unable to load holds");
        } finally {
            setLoading(false);
        }
    };

    const releaseHold = async (holdId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`https://library-management-system-8ktv.onrender.com/librarian/holds/${holdId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            setHolds(holds.filter(h => h.id !== holdId));
        } catch (err) {
            console.error("Error releasing hold", err);
        }
    };

    return (
        <div className="librarian-page">
            <Header />
            <div className="container">
                <h1 className="page-title">Manage Holds</h1>
                {loading ? (
                    <p>Loading holds...</p>
                ) : error ? (
                    <p className="alert alert-danger">{error}</p>
                ) : holds.length === 0 ? (
                    <p>No current holds.</p>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Item</th>
                                <th>Type</th>
                                <th>Hold Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {holds.map((hold) => (
                                <tr key={hold.id}>
                                    <td>{hold.user_name}</td>
                                    <td>{hold.item_title}</td>
                                    <td>{hold.item_type}</td>
                                    <td>{new Date(hold.placed_at).toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => releaseHold(hold.id)}
                                        >
                                            Release Hold
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
