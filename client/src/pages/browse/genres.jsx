import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./genres.css";

// Categorize genres into broader categories for display
const categorizeGenres = (genres) => {
    const categories = {
        "Fiction & Literature": [],
        "Science & Medicine": [],
        "Social Sciences": [],
        "Engineering & Technology": [],
        "History & Humanities": [],
        "Mathematics & Science": [],
        "Other": [],
    };

    genres.forEach((genre) => {
        const g = genre.toLowerCase();

        if (g.includes("fiction") || g.includes("romance") || g.includes("classic")) {
            categories["Fiction & Literature"].push(genre);
        } else if (
            g.includes("medicine") || g.includes("biology") || g.includes("pathology") ||
            g.includes("health") || g.includes("cardiology") || g.includes("surgery")
        ) {
            categories["Science & Medicine"].push(genre);
        } else if (
            g.includes("sociology") || g.includes("social") || g.includes("research") ||
            g.includes("economics") || g.includes("marketing") || g.includes("psychology")
        ) {
            categories["Social Sciences"].push(genre);
        } else if (
            g.includes("engineering") || g.includes("technology") || g.includes("computer") ||
            g.includes("mechanical") || g.includes("oil")
        ) {
            categories["Engineering & Technology"].push(genre);
        } else if (
            g.includes("history") || g.includes("geography") || g.includes("humanities") ||
            g.includes("archaeology")
        ) {
            categories["History & Humanities"].push(genre);
        } else if (
            g.includes("mathematics") || g.includes("physics") || g.includes("geometry") ||
            g.includes("science")
        ) {
            categories["Mathematics & Science"].push(genre);
        } else {
            categories["Other"].push(genre);
        }
    });

    return categories;
};

const Genre = () => {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [search_genre, setSearch_Genre] = useState([]);
    const [books, setBooks] = useState([]);
    const navigate = useNavigate();
    console.log(search_genre)


    const fetchBook = async (params = {}) => {
        console.log("Params:", params);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found. Redirecting to login...");
                window.location.href = "/login";
                return;
            }
    
            // Fix: Use search_value and search_by directly from state
    
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/books`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                params,
            });
    
            console.log("Books fetched:", response.data.books);
            setBooks(response.data.books || []);
        } catch (error) {
            console.error("Error fetching books:", error);
            setError("Failed to load books. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    useEffect((search_genre) => {
        fetchBook({
                search_by: "Genre",
                search_value: search_genre
            });
    }, []);
    useEffect(() => {
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
                        Authorization: `Bearer ${token}`,
                    },
                });

                const fetchedGenres = response.data.genres;
                if (Array.isArray(fetchedGenres)) {
                    const genreNames = fetchedGenres.map((g) => g.genre);
                    setGenres(genreNames);
                } else {
                    setGenres([]);
                    setError("Unexpected response format.");
                }
            } catch (error) {
                console.error("Error fetching genres:", error);
                setError("Failed to load genres. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchGenres();
    }, []);

    const categorized = categorizeGenres(genres);
    return (
        <div className="genre-container">
            <h1>Browse by Genre</h1>
            {loading && <p>Loading genres...</p>}
            {error && <p className="error">{error}</p>}

            <div className="cards-container">
                {Object.entries(categorized).map(([category, genreList]) => (
                    <div key={category} className="genre-card">
                        <h2>{category}</h2>
                        <div className="button-group">
                            {genreList.map((genre, index) => (
                                <button
                                    key={index}
                                    className="genre-button"
                                    // Navigate to /books?genre=GenreName
                                    onClick={() =>{
                                        navigate(`/browsebooks?genre=${encodeURIComponent(genre)}`)
                                        setSearch_Genre(genre)}
                                    }
                                >
                                    {genre}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Genre;
