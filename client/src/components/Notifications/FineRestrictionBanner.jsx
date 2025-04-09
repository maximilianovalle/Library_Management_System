import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FineRestrictionBanner.css';

const FineRestrictionBanner = () => {
    const [showBanner, setShowBanner] = useState(false);
    const [totalFines, setTotalFines] = useState(0);
    const [isCollapsed, setIsCollapsed] = useState(false);
    
    useEffect(() => {
        const checkFines = async () => {
            try {
                const token = localStorage.getItem("token");
                
                if (!token) {
                    return;
                }
                
                // Fetch user's fines
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/fines`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                
                const fines = response.data.fines || [];
                
                // Calculate total unpaid fines
                const unpaidTotal = fines
                    .filter(fine => fine.fine_status === 2) // 2 = Unpaid
                    .reduce((sum, fine) => sum + fine.amount, 0);
                
                setTotalFines(unpaidTotal);
                setShowBanner(unpaidTotal >= 25);
                
            } catch (error) {
                console.error("Error checking fines:", error);
            }
        };
        
        checkFines();
        
        // Check fines every hour
        const interval = setInterval(checkFines, 3600000);
        
        return () => clearInterval(interval);
    }, []);
    
    const handlePayNowClick = () => {
        // Redirect to account page
        window.location.href = "/account";
    };
    
    if (!showBanner) {
        return null;
    }
    
    return (
        <div className={`fine-restriction-banner ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="banner-content">
                <div className="banner-icon">⚠️</div>
                
                <div className="banner-message">
                    <h3>Account Restricted</h3>
                    <p>
                        Your unpaid fines total ${totalFines.toFixed(2)}. You cannot check out or place holds on items until your fines are paid.
                    </p>
                </div>
                
                <div className="banner-actions">
                    <button 
                        className="pay-now-button"
                        onClick={handlePayNowClick}
                    >
                        Pay Now
                    </button>
                    
                    <button 
                        className="collapse-button"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        aria-label={isCollapsed ? "Expand" : "Collapse"}
                    >
                        {isCollapsed ? "▼" : "▲"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FineRestrictionBanner;