import React, { useEffect } from "react";
// import axios from "axios";

import Header from "../../components/header/ManagerHeader";


const ReportsPage = () => {
    useEffect(() => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No token found. Redirecting to login...");
                window.location.href = "/login";
                return;
            }
            
        } catch (error) {
            console.error("Error fetching info: ", error);
        }
    }, []);

    return(
        <div>
            <Header />
            <h1>Reports</h1>
        </div>
    );
}

export default ReportsPage