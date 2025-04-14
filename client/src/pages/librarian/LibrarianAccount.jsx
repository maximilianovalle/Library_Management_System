import React, { useState, useEffect } from "react";
import axios from "axios";  // used for making HTTP requests
import './LibrarianAccount.css';
import Header from "../../components/header/LibrarianHeader";



const Account = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [hiredate, setHireDate] = useState("");
    const [enddate, setEndDate] = useState("");
    const [payrate, setPayRate] = useState("");
    const [position, setPosition] = useState("");
    const [department, setDepartment] = useState("");


    // triggered once when the page loads
    useEffect(() => {
        const fetchName = async () => {
            try {
                const token = localStorage.getItem("token");    // retrieve token from frontend localStorage

                // if ( no token )
                if (!token) {
                    console.error("No token found. Redirecting to login...");
                    window.location.href = "/login";
                    return;
                }

                // sends a GET request to /account including token
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/librarian_account`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                console.log(res.data)
                setFirstName(res.data.firstName);
                setLastName(res.data.lastName);
                setHireDate(res.data.hire_date);
                setEndDate(res.data.end_date);
                setPosition(res.data.position);
                setPayRate(res.data.pay_rate);
                setDepartment(res.data.department);
 

            } catch (error) {
                console.error("Error fetching account data:", error);
            }
        }
        fetchName();    // need to explicitly call fetchName to run
    }, []);

    return (
        <div>
            <Header />
    
            {/* main content */}
            <div id="main" className="account-container">
                <h1>My Account</h1>
                
                <div className="account-card">
                <div className="account-row">
                    <label>Name:</label>
                    <span>{`${firstName} ${lastName}`}</span>
                </div>
    
                    <div className="account-row">
                        <label>Position:</label>
                        <span>{position}</span>
                    </div>
    
                    <div className="account-row">
                        <label>Department:</label>
                        <span>{department}</span>
                    </div>
    
                    <div className="account-row">
                        <label>Hire Date:</label>
                        <span>{hiredate ? new Date(hiredate).toLocaleDateString() : "N/A"}</span>
                    </div>
    
                    <div className="account-row">
                        <label>End Date:</label>
                        <span>{enddate ? new Date(enddate).toLocaleDateString() : "Currently Employed"}</span>
                    </div>
    
                    <div className="account-row">
                        <label>Pay Rate:</label>
                        <span>${parseFloat(payrate).toFixed(2)} / hour</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;
