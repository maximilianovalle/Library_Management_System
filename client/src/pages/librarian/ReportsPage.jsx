import React, { useState } from "react";
import axios from "axios";
import Header from "../../components/header/LibrarianHeader";
import "./LibrarianPage.css";

const ReportsPage = () => {
    const [selectedReport, setSelectedReport] = useState(null);
    const [timeFrame, setTimeFrame] = useState("month");
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    const reportOptions = [
        {
            id: "popular-books",
            title: "Most Popular Books",
            description: "View the most checked out books in a specific time period",
            timeFrames: ["month", "six_months", "year"]
        },
        {
            id: "damaged-items",
            title: "Damaged Items",
            description: "View items reported as damaged in a specific time period",
            timeFrames: ["month", "six_months", "year"]
        },
        {
            id: "overdue-items",
            title: "Overdue Items",
            description: "View currently overdue items and associated fines",
            timeFrames: []
        },
        {
            id: "fine-collections",
            title: "Fine Collections",
            description: "View fine collection statistics for a specific time period",
            timeFrames: ["month", "six_months", "year"]
        },
        {
            id: "new-users",
            title: "New User Registrations",
            description: "View new user registration statistics for a specific time period",
            timeFrames: ["month", "six_months", "year"]
        }
    ];
    
    const generateReport = async () => {
        setLoading(true);
        setError("");
        setReportData(null);
        
        try {
            const token = localStorage.getItem("token");
            
            if (!token) {
                console.error("No token found. Redirecting to login...");
                window.location.href = "/login";
                return;
            }
            
            // Get the selected report option
            const reportOption = reportOptions.find(option => option.id === selectedReport);
            
            // Determine if we need to send the timeFrame
            const params = reportOption.timeFrames.length > 0 ? { timeFrame } : {};
            
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/librarian/reports/${selectedReport}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                params
            });
            
            setReportData(response.data);
        } catch (error) {
            console.error("Error generating report:", error);
            setError("Failed to generate report. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    
    const renderReportContent = () => {
        if (!reportData) return null;
        
        switch (selectedReport) {
            case "popular-books":
                return renderPopularBooksReport();
            case "damaged-items":
                return renderDamagedItemsReport();
            case "overdue-items":
                return renderOverdueItemsReport();
            case "fine-collections":
                return renderFineCollectionsReport();
            case "new-users":
                return renderNewUsersReport();
            default:
                return <p>Select a report type to view data</p>;
        }
    };
    
    // Render functions for each report type
    const renderPopularBooksReport = () => {
        const { books, timeFrameLabel } = reportData;
        return (
            <>
                <h3>Most Popular Books - {timeFrameLabel}</h3>
                {books.length > 0 ? (
                    <table className="table table-hover">
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
                            {books.map((book, index) => (
                                <tr key={book.isbn}>
                                    <td>{index + 1}</td>
                                    <td>{book.title}</td>
                                    <td>{book.author}</td>
                                    <td>{book.genre}</td>
                                    <td>{book.checkouts}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No checkout data available for this period</p>
                )}
            </>
        );
    };
    
    const renderDamagedItemsReport = () => {
        const { books, devices, timeFrameLabel } = reportData;
        return (
            <>
                <h3>Damaged Items - {timeFrameLabel}</h3>
                
                <h4>Damaged Books</h4>
                {books.length > 0 ? (
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Copy ID</th>
                                <th>Return Date</th>
                                <th>Fine Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book) => (
                                <tr key={`${book.isbn}-${book.copy_id}`}>
                                    <td>{book.title}</td>
                                    <td>{book.author}</td>
                                    <td>{book.copy_id}</td>
                                    <td>{new Date(book.return_date).toLocaleDateString()}</td>
                                    <td>${book.fine_amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No damaged books reported in this period</p>
                )}
                
                <h4>Damaged Devices</h4>
                {devices.length > 0 ? (
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Model</th>
                                <th>Copy ID</th>
                                <th>Return Date</th>
                                <th>Fine Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {devices.map((device) => (
                                <tr key={`${device.category}-${device.model}-${device.copy_id}`}>
                                    <td>{device.category}</td>
                                    <td>{device.model}</td>
                                    <td>{device.copy_id}</td>
                                    <td>{new Date(device.return_date).toLocaleDateString()}</td>
                                    <td>${device.fine_amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No damaged devices reported in this period</p>
                )}
            </>
        );
    };
    
    const renderOverdueItemsReport = () => {
        const { books, devices, totalFinesDue } = reportData;
        return (
            <>
                <h3>Overdue Items Report</h3>
                <div className="report-summary">
                    <p><strong>Total Fines Due:</strong> ${totalFinesDue.toFixed(2)}</p>
                    <p><strong>Total Overdue Items:</strong> {books.length + devices.length}</p>
                </div>
                
                <h4>Overdue Books</h4>
                {books.length > 0 ? (
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>User</th>
                                <th>Due Date</th>
                                <th>Days Overdue</th>
                                <th>Fine Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book) => (
                                <tr key={`${book.record_id}`}>
                                    <td>{book.title}</td>
                                    <td>{book.user_name}</td>
                                    <td>{new Date(book.due_date).toLocaleDateString()}</td>
                                    <td>{book.days_overdue}</td>
                                    <td>${book.fine_amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No overdue books</p>
                )}
                
                <h4>Overdue Devices</h4>
                {devices.length > 0 ? (
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Device</th>
                                <th>User</th>
                                <th>Due Date</th>
                                <th>Days Overdue</th>
                                <th>Fine Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {devices.map((device) => (
                                <tr key={`${device.record_id}`}>
                                    <td>{device.model} ({device.category})</td>
                                    <td>{device.user_name}</td>
                                    <td>{new Date(device.due_date).toLocaleDateString()}</td>
                                    <td>{device.days_overdue}</td>
                                    <td>${device.fine_amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No overdue devices</p>
                )}
            </>
        );
    };
    
    const renderFineCollectionsReport = () => {
        const { 
            totalCollected, 
            totalOutstanding,
            collectionsByReason,
            timeFrameLabel
        } = reportData;
        
        return (
            <>
                <h3>Fine Collections - {timeFrameLabel}</h3>
                <div className="report-summary">
                    <p><strong>Total Collected:</strong> ${totalCollected.toFixed(2)}</p>
                    <p><strong>Total Outstanding:</strong> ${totalOutstanding.toFixed(2)}</p>
                </div>
                
                <h4>Collections by Reason</h4>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Reason</th>
                            <th>Amount Collected</th>
                            <th>Amount Outstanding</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(collectionsByReason).map(([reason, data]) => (
                            <tr key={reason}>
                                <td>{reason}</td>
                                <td>${data.collected.toFixed(2)}</td>
                                <td>${data.outstanding.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </>
        );
    };
    
    const renderNewUsersReport = () => {
        const { 
            totalNewUsers,
            usersByRole,
            monthlyBreakdown,
            timeFrameLabel
        } = reportData;
        
        return (
            <>
                <h3>New User Registrations - {timeFrameLabel}</h3>
                <div className="report-summary">
                    <p><strong>Total New Users:</strong> {totalNewUsers}</p>
                </div>
                
                <h4>Users by Role</h4>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Role</th>
                            <th>Count</th>
                            <th>Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(usersByRole).map(([role, data]) => (
                            <tr key={role}>
                                <td>{role}</td>
                                <td>{data.count}</td>
                                <td>{data.percentage}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                <h4>Monthly Breakdown</h4>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>New Users</th>
                        </tr>
                    </thead>
                    <tbody>
                        {monthlyBreakdown.map((month) => (
                            <tr key={month.month}>
                                <td>{month.month}</td>
                                <td>{month.count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </>
        );
    };
    
    const formatTimeFrame = (timeFrame) => {
        switch (timeFrame) {
            case 'month':
                return 'Last Month';
            case 'six_months':
                return 'Last 6 Months';
            case 'year':
                return 'Last Year';
            default:
                return timeFrame;
        }
    };

    return (
        <div className="librarian-page">
            <Header />
            
            <div className="container">
                <h1 className="page-title">Library Reports</h1>
                
                <div className="report-options">
                    {reportOptions.map((option) => (
                        <div 
                            key={option.id}
                            className={`report-card ${selectedReport === option.id ? 'selected' : ''}`}
                            onClick={() => setSelectedReport(option.id)}
                        >
                            <h3>{option.title}</h3>
                            <p>{option.description}</p>
                            
                            {selectedReport === option.id && option.timeFrames.length > 0 && (
                                <div className="time-frame-selector">
                                    <label>Time Period:</label>
                                    <select 
                                        value={timeFrame}
                                        onChange={(e) => setTimeFrame(e.target.value)}
                                        className="form-select"
                                    >
                                        {option.timeFrames.map((tf) => (
                                            <option key={tf} value={tf}>
                                                {formatTimeFrame(tf)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            
                            {selectedReport === option.id && (
                                <button 
                                    className="btn btn-primary mt-4"
                                    onClick={generateReport}
                                    disabled={loading}
                                >
                                    {loading ? 'Generating...' : 'Generate Report'}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                
                {error && <div className="alert alert-danger">{error}</div>}
                
                {loading ? (
                    <div className="loading">Generating report...</div>
                ) : (
                    <div className="report-content">
                        {renderReportContent()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportsPage;