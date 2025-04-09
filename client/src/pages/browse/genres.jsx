import React, { useState, useEffect } from "react";
import axios from 'axios';
import './genres.css';



const Genre = () => {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    useEffect (() => {

        const fetchGenres = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("No token found. Redirecting to login...");
                    window.location.href = "/login";
                    return;
                }
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/genres`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });
                console.log(response)
                const fetchedGenres = response.data;
                console.log("fetched: ", response.data.genres)
                if (Array.isArray(fetchedGenres)) {
                    setGenres(fetchedGenres);
                } else {
                    setGenres([]);
                    setError("Unexpected response format.");
                };
            } catch (error) {
                console.error("Error fetching genres:", error);
                setError("Failed to load genres. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchGenres();
    }, [])

    return (
        <div className="genre-container">
            <h1>Genres</h1>
            {loading && <p>Loading genres...</p>}
            {error && <p>{error}</p>}
            <ul>
                {Array.isArray(genres) && genres.map((g, index) => (
                    <li key={index}>{g.genre}</li>
                ))}
            </ul>
        </div>
    );
};

export default Genre;
