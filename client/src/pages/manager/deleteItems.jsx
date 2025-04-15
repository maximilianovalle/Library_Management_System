import React, { useState, useEffect } from "react";
import axios from "axios";

import { MdLaptopChromebook } from "react-icons/md";
import { BiLibrary } from "react-icons/bi";

import Header from "../../components/header/ManagerHeader";
import "./deleteItems.css";


const ManagerDeleteItems = () => {

    const [books, setBooks] = useState([]);
    const [devices, setDevices] = useState([]);

    const [activeTab, setActiveTab] = useState("books");
    const [toast, setToast] = useState({ message: "", type: "" });


    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: "", type: "" }), 3000);
    };

    const fetchItems = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get(`${process.env.REACT_APP_API}/manage_items`, {
                headers: {"Authorization": `Bearer ${token}`},
            });

            setBooks(res.data.books);
            setDevices(res.data.devices);
        } catch (error) {
            console.error("Error fetching books: ", error);
        }
    }

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

        fetchItems();
    }, []);

    return (
        <div>
            <Header />
            <div id="body">

                {toast.message && <div className={`toast ${toast.type}`}>{toast.message}</div>}

                <h2 id="dashboardTitle" className="dashboard-title manageLibrariansTitle">Manage Catalogue</h2>
    
                {/* tab buttons */}

                <div className="tab-buttons dashboard-header dashboard-title">
                    <button className={`tab-button ${activeTab === "books" ? "active" : ""}`} onClick={() => {
                        setActiveTab("books");
                    }}><BiLibrary /></button>

                    <button className={`tab-button ${activeTab === "devices" ? "active" : ""}`} onClick={() => {
                        setActiveTab("devices");
                    }}><MdLaptopChromebook /></button>
                </div>

                {/* books tab */}

                {activeTab === "books" && (
                    <p>Test</p>
                )}

                {/* devices tab */}

                {activeTab === "devices" && (
                    <p>Test 2</p>
                )}
                

            </div>
        </div>
    )

}

export default ManagerDeleteItems;