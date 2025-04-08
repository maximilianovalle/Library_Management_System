// import React from 'react';
// import { useState, useEffect } from "react";
// import axios from 'axios';
// import './genres.css';

// const Genre = () => {

//     const [genres, setGenres] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
//     console.log("Genres:", genres);
//     const fetchGenres = async () => {
//         try {
//             setLoading(true);
//             const token = localStorage.getItem("token");
//             if (!token) {
//                 console.error("No token found. Redirecting to login...");
//                 window.location.href = "/login";
//                 return;
//             }
            
//             const response = await axios.get('https://library-management-system-8ktv.onrender.com/genres', {
//                 headers: {
//                     "Authorization": `Bearer ${token}`,
//                 },
//             });

//             console.log("Genres fetched:", response.data.genres);
//             setGenres(response.data.genres);
//         } catch (error) {
//             console.error("Error fetching genres:", error);
//             setError("Failed to load genres. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchGenres();
//     }, []);

//     return (
//         <div className="genre-container">
//             <h1>Genres</h1>
//             {loading && <p>Loading genres...</p>}
//             {error && <p>{error}</p>}
 
//         </div>
//     );
// };

// export default Genre;
