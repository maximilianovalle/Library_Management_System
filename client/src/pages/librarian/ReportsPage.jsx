import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/header/LibrarianHeader";
import DateRangeSelector from "./DateRangeSelector";
import "../librarian/ReportsPage.css";
import "./DateRangeSelector.css";

const ReportsPage = () => {
    const [activeReport, setActiveReport] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [dateRange, setDateRange] = useState("week"); // Default to week view
    
    const reportOptions = [
        { id: "overview", name: "Library Overview" },
        { id: "overdue", name: "Overdue Items" },
        { id: "fines", name: "Fines & Payments" },
        { id: "checkouts", name: "Current Checkouts" },
        { id: "popular", name: "Popular Items" }
    ];
    
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("No token found. Redirecting to login...");
                    window.location.href = "/login";
                    return;
                }
            } catch (error) {
                console.error("Error checking authentication:", error);
            }
        };
        
        checkAuth();
    }, []);
    
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };
    
    const selectReport = (reportId) => {
        setActiveReport(reportId);
        setShowDropdown(false);
        fetchReportData(reportId, dateRange);
    };
    
    const handleDateRangeChange = (newRange) => {
        setDateRange(newRange);
        if (activeReport) {
            fetchReportData(activeReport, newRange);
        }
    };
    
    const fetchReportData = async (reportType, range) => {
        setLoading(true);
        setError("");
        localStorage.removeItem('reportError');
        
        try {
            const token = localStorage.getItem("token");
            
            if (!token) {
                console.error("No token found");
                localStorage.removeItem("token"); 
                window.location.href = "/login";
                return;
            }
            
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/reports`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                params: {
                    type: reportType,
                    dateRange: range
                }
            });
            
            setReportData(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching report data:", error);
            
            if (error.response && error.response.status === 401) {
                localStorage.removeItem("token"); 
                setError("Your session has expired. Please log in again.");
                setTimeout(() => {
                    window.location.href = "/login";
                }, 2000);
            } else {
                setError("Failed to load report data. Please try again.");
            }
            setLoading(false);
            
            localStorage.setItem('reportError', error.response?.data?.message || "Failed to load report data");
        }
    };
    
    const clearError = () => {
        setError("");
        localStorage.removeItem('reportError');
        
        if (activeReport) {
            fetchReportData(activeReport, dateRange);
        }
    };
    
    // Report rendering functions remain the same as in the original file
    const renderOverviewReport = () => {
        if (!reportData) return null;
        
        const { books, devices, fines, overdue } = reportData;
        
        return (
            <div className="overview-report">
                <div className="table-container">
                    <h3 className="table-title">Library Inventory Summary</h3>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Total Items</th>
                                <th>Available</th>
                                <th>Checked Out</th>
                                <th>Availability %</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Books</strong></td>
                                <td>{books.total_books}</td>
                                <td>{books.available_books}</td>
                                <td>{books.checked_out_books}</td>
                                <td>{books.total_books ? ((books.available_books / books.total_books) * 100).toFixed(1) : 0}%</td>
                            </tr>
                            <tr>
                                <td><strong>Devices</strong></td>
                                <td>{devices.total_devices}</td>
                                <td>{devices.available_devices}</td>
                                <td>{devices.checked_out_devices}</td>
                                <td>{devices.total_devices ? ((devices.available_devices / devices.total_devices) * 100).toFixed(1) : 0}%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div className="table-container">
                    <h3 className="table-title">Financial & Activity Summary</h3>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Metric</th>
                                <th>Value</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Total Unpaid Fines</strong></td>
                                <td className="emphasis">${fines.unpaid_amount ? fines.unpaid_amount.toFixed(2) : '0.00'}</td>
                                <td>From {fines.total_fines || 0} outstanding fines</td>
                            </tr>
                            <tr>
                                <td><strong>Total Collected Fines</strong></td>
                                <td>${fines.paid_amount ? fines.paid_amount.toFixed(2) : '0.00'}</td>
                                <td>All time collected amount</td>
                            </tr>
                            <tr>
                                <td><strong>Overdue Books</strong></td>
                                <td className={overdue.overdue_books > 0 ? "warning" : ""}>{overdue.overdue_books}</td>
                                <td>Currently past due date</td>
                            </tr>
                            <tr>
                                <td><strong>Overdue Devices</strong></td>
                                <td className={overdue.overdue_devices > 0 ? "warning" : ""}>{overdue.overdue_devices}</td>
                                <td>Currently past due date</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };
    
    const renderOverdueReport = () => {
        if (!reportData) return null;
        
        const { books, devices } = reportData;
        
        return (
            <div className="overdue-report">
                <div className="table-container">
                    <h3 className="table-title">Overdue Books <span className="badge">{books.length}</span></h3>
                    {books.length > 0 ? (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>User</th>
                                    <th>Checkout Date</th>
                                    <th>Due Date</th>
                                    <th>Days Overdue</th>
                                    <th>User Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {books.map((book) => {
                                    const dueDate = new Date(book.Due_Date);
                                    const today = new Date();
                                    const diffTime = Math.abs(today - dueDate);
                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                    
                                    return (
                                        <tr key={book.Record_ID}>
                                            <td>{book.Title}</td>
                                            <td>{book.Author_Name}</td>
                                            <td>{book.First_Name} {book.Last_Name}</td>
                                            <td>{new Date(book.Checkout_Date).toLocaleDateString()}</td>
                                            <td>{new Date(book.Due_Date).toLocaleDateString()}</td>
                                            <td className="overdue-days">{diffDays}</td>
                                            <td>{book.User_Role}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <p className="no-data-message">No overdue books found.</p>
                    )}
                </div>
                
                <div className="table-container">
                    <h3 className="table-title">Overdue Devices <span className="badge">{devices.length}</span></h3>
                    {devices.length > 0 ? (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Model</th>
                                    <th>User</th>
                                    <th>Due Date</th>
                                    <th>Days Overdue</th>
                                    <th>User Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {devices.map((device) => {
                                    const dueDate = new Date(device.Due_Date);
                                    const today = new Date();
                                    const diffTime = Math.abs(today - dueDate);
                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                    
                                    return (
                                        <tr key={device.Record_ID}>
                                            <td>{device.Category}</td>
                                            <td>{device.Model}</td>
                                            <td>{device.First_Name} {device.Last_Name}</td>
                                            <td>{new Date(device.Due_Date).toLocaleDateString()}</td>
                                            <td className="overdue-days">{diffDays}</td>
                                            <td>{device.User_Role}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <p className="no-data-message">No overdue devices found.</p>
                    )}
                </div>
            </div>
        );
    };
    
    const renderFinesReport = () => {
        if (!reportData) return null;
        
        const { fines, reasonStats, roleStats } = reportData;
        
        return (
            <div className="fines-report">
                <div className="table-container">
                    <h3 className="table-title">Fines by Reason</h3>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Reason</th>
                                <th>Count</th>
                                <th>Total Amount</th>
                                <th>Paid Amount</th>
                                <th>Unpaid Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reasonStats.map((stat) => (
                                <tr key={stat.Reason}>
                                    <td>{stat.Reason}</td>
                                    <td>{stat.count}</td>
                                    <td>${Number(stat.total_amount || 0).toFixed(2)}</td>
                                    <td>${Number(stat.paid_amount || 0).toFixed(2)}</td>
                                    <td className={stat.unpaid_amount > 0 ? "warning" : ""}>
                                        ${Number(stat.unpaid_amount || 0).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="table-container">
                    <h3 className="table-title">Fines by User Role</h3>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>User Role</th>
                                <th>Count</th>
                                <th>Total Amount</th>
                                <th>% of All Fines</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roleStats.map((stat) => {
                                const totalFines = roleStats.reduce((sum, item) => sum + item.total_amount, 0);
                                const percentage = (stat.total_amount / totalFines * 100).toFixed(1);
                                
                            return (
                                <tr key={stat.User_Role}>
                                    <td>{stat.User_Role}</td>
                                    <td>{stat.count}</td>
                                    <td>${Number(stat.total_amount || 0).toFixed(2)}</td>
                                    <td>{percentage}%</td>
                                </tr>
                            );
                            })}
                        </tbody>
                    </table>
                </div>
                
                <div className="table-container">
                    <h3 className="table-title">Fine Details <span className="badge">{fines.length}</span></h3>
                    {fines.length > 0 ? (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Amount</th>
                                    <th>Reason</th>
                                    <th>Date Issued</th>
                                    <th>Status</th>
                                    <th>User Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fines.map((fine) => (
                                    <tr key={fine.Fine_ID}>
                                        <td>{fine.First_Name} {fine.Last_Name}</td>
                                        <td>${fine.Amount.toFixed(2)}</td>
                                        <td>{fine.Reason}</td>
                                        <td>{new Date(fine.Date_Issued).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`status-badge ${fine.Fine_Status === 1 ? 'paid' : 'unpaid'}`}>
                                                {fine.Fine_Status === 1 ? 'Paid' : 'Unpaid'}
                                            </span>
                                        </td>
                                        <td>{fine.User_Role}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="no-data-message">No fines found.</p>
                    )}
                </div>
            </div>
        );
    };
    
    const renderCheckoutsReport = () => {
        if (!reportData) return null;
        
        const { books, devices, userRoleStats } = reportData;
        
        return (
            <div className="checkouts-report">
                <div className="table-container">
                    <h3 className="table-title">Checkouts by User Role</h3>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>User Role</th>
                                <th>Checkouts</th>
                                <th>Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userRoleStats.map((stat) => {
                                const totalCheckouts = userRoleStats.reduce((sum, item) => sum + item.count, 0);
                                const percentage = (stat.count / totalCheckouts * 100).toFixed(1);
                                
                                return (
                                    <tr key={stat.User_Role}>
                                        <td>{stat.User_Role}</td>
                                        <td>{stat.count}</td>
                                        <td>{percentage}%</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                
                <div className="table-container">
                    <h3 className="table-title">Checked Out Books <span className="badge">{books.length}</span></h3>
                    {books.length > 0 ? (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>User</th>
                                    <th>Checkout Date</th>
                                    <th>Due Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {books.map((book) => (
                                    <tr key={book.Record_ID}>
                                        <td>{book.Title}</td>
                                        <td>{book.Author_Name}</td>
                                        <td>{book.First_Name} {book.Last_Name}</td>
                                        <td>{new Date(book.Checkout_Date).toLocaleDateString()}</td>
                                        <td>{new Date(book.Due_Date).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`status-badge ${book.Is_Overdue ? 'overdue' : 'active'}`}>
                                                {book.Is_Overdue ? 'Overdue' : 'Active'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="no-data-message">No checked out books found.</p>
                    )}
                </div>
                
                <div className="table-container">
                    <h3 className="table-title">Checked Out Devices <span className="badge">{devices.length}</span></h3>
                    {devices.length > 0 ? (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Model</th>
                                    <th>User</th>
                                    <th>Checkout Date</th>
                                    <th>Due Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {devices.map((device) => (
                                    <tr key={device.Record_ID}>
                                        <td>{device.Category}</td>
                                        <td>{device.Model}</td>
                                        <td>{device.First_Name} {device.Last_Name}</td>
                                        <td>{new Date(device.Checkout_Date).toLocaleDateString()}</td>
                                        <td>{new Date(device.Due_Date).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`status-badge ${device.Is_Overdue ? 'overdue' : 'active'}`}>
                                                {device.Is_Overdue ? 'Overdue' : 'Active'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="no-data-message">No checked out devices found.</p>
                    )}
                </div>
            </div>
        );
    };
    
    const renderPopularItemsReport = () => {
        if (!reportData) return null;
        
        const { popularBooks, popularDevices, genreStats } = reportData;
        
        return (
            <div className="popular-items-report">
                <div className="table-container">
                    <h3 className="table-title">Most Popular Books</h3>
                    {popularBooks.length > 0 ? (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>Genre</th>
                                    <th>Checkouts</th>
                                </tr>
                            </thead>
                            <tbody>
                                {popularBooks.map((book, index) => (
                                    <tr key={book.ISBN}>
                                        <td className="rank-cell">{index + 1}</td>
                                        <td>{book.Title}</td>
                                        <td>{book.Author_Name}</td>
                                        <td>{book.Genre}</td>
                                        <td className="count-cell">{book.checkout_count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="no-data-message">No popular books data available.</p>
                    )}
                </div>
                
                <div className="table-container">
                    <h3 className="table-title">Most Popular Devices</h3>
                    {popularDevices.length > 0 ? (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Category</th>
                                    <th>Model</th>
                                    <th>Checkouts</th>
                                </tr>
                            </thead>
                            <tbody>
                                {popularDevices.map((device, index) => (
                                    <tr key={`${device.Category}-${device.Model}`}>
                                        <td className="rank-cell">{index + 1}</td>
                                        <td>{device.Category}</td>
                                        <td>{device.Model}</td>
                                        <td className="count-cell">{device.checkout_count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="no-data-message">No popular devices data available.</p>
                    )}
                </div>
                
                <div className="table-container">
                    <h3 className="table-title">Checkouts by Genre</h3>
                    {genreStats.length > 0 ? (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Genre</th>
                                    <th>Total Checkouts</th>
                                </tr>
                            </thead>
                            <tbody>
                                {genreStats.map((genre) => (
                                    <tr key={genre.Genre}>
                                        <td>{genre.Genre}</td>
                                        <td className="count-cell">{genre.checkout_count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="no-data-message">No genre checkout data available.</p>
                    )}
                </div>
            </div>
        );
    };
    
    const renderReportContent = () => {
        if (error) {
            return (
                <div className="persistent-error-message">
                    <span>{error}</span>
                    <button className="clear-error-button" onClick={clearError}>
                        Try Again
                    </button>
                </div>
            );
        }
        
        if (loading) {
            return <div className="loading">Loading report data...</div>;
        }
        
        if (!activeReport) {
            return (
                <div className="select-report-prompt">
                    <h3>Please select a report from the dropdown above</h3>
                    <p>Click on "Select a Report" to see available reports</p>
                </div>
            );
        }
        
        switch (activeReport) {
            case "overview":
                return renderOverviewReport();
            case "overdue":
                return renderOverdueReport();
            case "fines":
                return renderFinesReport();
            case "checkouts":
                return renderCheckoutsReport();
            case "popular":
                return renderPopularItemsReport();
            default:
                return null;
        }
    };

    return (
        <div className="reports-page">
            <Header />
            <div className="container">
                <h1 className="page-title">Library Reports</h1>
                <div className="report-content">
                    <div className="reports-selector">
                        <div className="dropdown-container">
                            <button 
                                className="report-dropdown-button" 
                                onClick={toggleDropdown}
                            >
                                {activeReport ? reportOptions.find(r => r.id === activeReport).name : "Select a Report"} ▼
                            </button>
                            
                            {showDropdown && (
                                <div className="report-dropdown-menu">
                                    {reportOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            className={`report-option ${activeReport === option.id ? 'active' : ''}`}
                                            onClick={() => selectReport(option.id)}
                                        >
                                            {option.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {activeReport && (
                            <DateRangeSelector 
                                activeRange={dateRange}
                                onRangeChange={handleDateRangeChange}
                            />
                        )}
                    </div>
                    
                    <div className="report-data-container">
                        {renderReportContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;