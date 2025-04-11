import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./genres.css";

const Genre = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const categorized = {
        "Popular": ["Romance", "Thriller", "Fantasy", "Mystery", "Science Fiction"],
        "Fiction & Literature": [],
        "Science & Medicine": [],
        "Social Sciences": [],
        "Engineering & Technology": [],
        "History & Humanities": [],
        "Mathematics & Science": [],
        "Other": [],
    };

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                if (!token) {
                    window.location.href = "/login";
                    return;
                }

                const response = await axios.get(`${process.env.REACT_APP_API_URL}/genres`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const genreNames = response.data.genres?.map((g) => g.genre.toLowerCase()) || [];

                genreNames.forEach((g) => {
                    if (g.includes("fiction") || g.includes("romance") || g.includes("classic")) {
                        categorized["Fiction & Literature"].push(g);
                    } else if (g.includes("medicine") || g.includes("biology") || g.includes("health")) {
                        categorized["Science & Medicine"].push(g);
                    } else if (g.includes("sociology") || g.includes("social") || g.includes("economics")) {
                        categorized["Social Sciences"].push(g);
                    } else if (g.includes("engineering") || g.includes("technology") || g.includes("computer")) {
                        categorized["Engineering & Technology"].push(g);
                    } else if (g.includes("history") || g.includes("geography") || g.includes("humanities")) {
                        categorized["History & Humanities"].push(g);
                    } else if (g.includes("mathematics") || g.includes("physics") || g.includes("science")) {
                        categorized["Mathematics & Science"].push(g);
                    } else {
                        categorized["Other"].push(g);
                    }
                });

            } catch (err) {
                console.error("Error fetching genres:", err);
                setError("Failed to load genres. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchGenres();
    }, []);

    const handleClick = (category) => {
        const search_value = categorized[category]?.join(",") || "";
        navigate(`/browsebooks?search_by=Genre&search_value=${encodeURIComponent(search_value)}`);
    };

    return (
        <div className="genre-container">
            <h1>Browse by Genre</h1>
            {loading && <p>Loading genres...</p>}
            {error && <p className="error">{error}</p>}
            <div className="genre-button-grid">
                {Object.keys(categorized).map((category, index) => (
                    <button
                        key={index}
                        className="genre-big-button"
                        onClick={() => handleClick(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Genre;
