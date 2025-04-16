import React, { useState, useEffect } from "react";
import { FaBook, FaTabletAlt, FaUsers, FaChartBar } from 'react-icons/fa';
import axios from "axios";
import Header from "../../components/header/LibrarianHeader";
import { Link } from "react-router-dom";
import "./LibrarianPage.css";

// Icon components
const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dashboard-icon">
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
    <line x1="16" y1="8" x2="16" y2="16"></line>
    <line x1="12" y1="12" x2="12" y2="16"></line>
    <line x1="8" y1="10" x2="8" y2="16"></line>
  </svg>
);

const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dashboard-icon">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>
);

const DeviceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dashboard-icon">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
    <line x1="12" y1="18" x2="12" y2="18"></line>
  </svg>
);

const AlertIcon = () => (
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dashboard-icon">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="6" x2="12" y2="12"></line>
    <line x1="12" y1="12" x2="15" y2="9"></line>
    <line x1="12" y1="17" x2="12" y2="17.5"></line>
    <line x1="13" y1="17" x2="13" y2="17.5"></line>
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dashboard-icon">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const MoneyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dashboard-icon">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dashboard-icon">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const LibrarianDashboard = () => {
    const [librarian_name_first, setLibrarian_Name_First] = useState()
    const [librarian_name_last, setLibrarian_Name_Last] = useState()

    const [totalBooks, setTotalBooks] = useState(0);
    const [totalDevices, setTotalDevices] = useState(0);
    const [checkedOutBooks, setCheckedOutBooks] = useState(0);
    const [checkedOutDevices, setCheckedOutDevices] = useState(0);
    const [overdueItems, setOverdueItems] = useState(0);
    const [activeHolds, setActiveHolds] = useState(0);
    const [finesDue, setFinesDue] = useState(0);
    
    const [timeframe, setTimeframe] = useState("week");
    // const [recentActivity, setRecentActivity] = useState([]);
    
    // const [popularBooks, setPopularBooks] = useState([]);
    
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                
                if (!token) {
                    console.error("No token found. Redirecting to login...");
                    window.location.href = "/login";
                    return;
                }
                
                // Simulate API call delay
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
                            
                const statsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/stats`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                const data = statsResponse.data;
                console.log(data)
                try{
                    setTotalBooks(data.totalBooks);
                    setTotalDevices(data.totalDevices);
                    setCheckedOutBooks(data.checkedOutBooks);
                    setCheckedOutDevices(data.checkedOutDevices);
                    setOverdueItems(data.overdueItems);
                    setActiveHolds(data.activeHolds);
                    setFinesDue(data.finesDue);
                } catch(error) {
                    console.error("Error fetching stats:", error);
                }
                
                
                // const activityResponse = await axios.get(`${process.env.REACT_APP_API_URL}/get_activity`, {
                //     headers: {
                //         "Authorization": `Bearer ${token}`
                //     }
                // });
                // console.log(activityResponse.data)
                // setRecentActivity(activityResponse.data.activities);

            //    const popular_books_response = await axios.get(`${process.env.REACT_APP_API_URL}/reports?type=popular`, {
            //         headers: {
            //             "Authorization": `Bearer ${token}`
            //         }
            //     });
            //     console.log(popular_books_response.data.popularBooks)
            //     setPopularBooks(popular_books_response.data.popularBooks)


                const librarian_info_response =  await axios.get(`${process.env.REACT_APP_API_URL}/librarian_account`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                console.log(librarian_info_response.data)
                setLibrarian_Name_First(librarian_info_response.data.firstName)
                setLibrarian_Name_Last(librarian_info_response.data.lastName)

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchDashboardData();
    }, []);
    
    // Format date for display
    const formatTime = (timestamp) => {
        // For today, just show the time
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const itemDate = new Date(timestamp);
        const itemDay = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
        
        if (itemDay.getTime() === today.getTime()) {
            return `Today at ${itemDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
        
        // For yesterday
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (itemDay.getTime() === yesterday.getTime()) {
            return `Yesterday at ${itemDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
        
        return `${itemDate.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${itemDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };
    
    const getActivityIcon = (type) => {
        switch(type) {
            case 'book':
                return <BookIcon />;
            case 'device':
                return <DeviceIcon />;
            case 'payment':
                return <MoneyIcon />;
            default:
                return <CalendarIcon />;
        }
    };
    
    const handleTimeframeChange = (newTimeframe) => {
        setTimeframe(newTimeframe);
        // In a real implementation, you would fetch new data here
    };

    return (
        <div className="librarian-dashboard-page">
            <Header />
            
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">Librarian Dashboard</h1>
                    
                    <div className="dashboard-welcome">

                        <div className="welcome-message">
                            <h2>Welcome back, {librarian_name_first} {librarian_name_last}</h2>
                            <p>Here's what's happening at your library today</p>
                        </div>

                        <div className="current-date">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                </div>
                
                {loading ? (
                    <div className="dashboard-loading">
                        <div className="spinner"></div>
                        <p>Loading dashboard data...</p>
                    </div>
                ) : (
                    <>
                        <div className="dashboard-stats-grid">
                            <div className="stat-card books-total">
                                <div className="stat-icon">
                                    <BookIcon />
                                </div>
                                <div className="stat-content">
                                    <h3>Total Books</h3>
                                    <p className="stat-value">{totalBooks.toLocaleString()}</p>
                                </div>
                            </div>
                            
                            <div className="stat-card devices-total">
                                <div className="stat-icon">
                                    <DeviceIcon />
                                </div>
                                <div className="stat-content">
                                    <h3>Total Devices</h3>
                                    <p className="stat-value">{totalDevices.toLocaleString()}</p>
                                </div>
                            </div>
                            
                            <div className="stat-card books-checked">
                                <div className="stat-icon">
                                    <ChartIcon />
                                </div>
                                <div className="stat-content">
                                    <h3>Checked Out Books</h3>
                                    <p className="stat-value">{checkedOutBooks.toLocaleString()}</p>
                                    <p className="stat-percentage">
                                        {Math.round((checkedOutBooks / totalBooks) * 100)}% of inventory
                                    </p>
                                </div>
                            </div>
                            
                            <div className="stat-card devices-checked">
                                <div className="stat-icon">
                                    <ChartIcon />
                                </div>
                                <div className="stat-content">
                                    <h3>Checked Out Devices</h3>
                                    <p className="stat-value">{checkedOutDevices.toLocaleString()}</p>
                                    <p className="stat-percentage">
                                        {Math.round((checkedOutDevices / totalDevices) * 100)}% of inventory
                                    </p>
                                </div>
                            </div>
                            
                            <div className="stat-card alert-card overdue">
                                <div className="stat-icon">
                                    <AlertIcon />
                                </div>
                                <div className="stat-content">
                                    <h3>Overdue Items</h3>
                                    <p className="stat-value">{overdueItems.toLocaleString()}</p>
                                </div>
                            </div>
                            
                            <div className="stat-card holds">
                                <div className="stat-icon">
                                    <UsersIcon />
                                </div>
                                <div className="stat-content">
                                    <h3>Active Holds</h3>
                                    <p className="stat-value">{activeHolds.toLocaleString()}</p>
                                    <Link to="/librarian/holds" className="stat-link">Manage holds</Link>
                                </div>
                            </div>
                            
                            <div className="stat-card fines">
                                <div className="stat-icon">
                                    <MoneyIcon />
                                </div>
                                <div className="stat-content">
                                    <h3>Fines Due</h3>
                                    <p className="stat-value">
                                        ${typeof finesDue === 'number' ? finesDue.toFixed(2) : Number(finesDue || 0).toFixed(2)}
                                    </p>
                                    <Link to="/librarian/fines" className="stat-link">View all fines</Link>
                                </div>
                            </div>
                        </div>
                        
                        <div className="dashboard-content">
                            <div className="dashboard-section">

                                <div className="section-header">
                                    <h2>Quick Actions</h2>
                                </div>

                                <div className="quick-actions">
                                    <Link to="/librarian/manage-books/add" className="action-button add-book">
                                        <FaBook className="icon"/>
                                        <span>Add New Book</span>
                                    </Link>
                                    <Link to="/librarian/manage-devices/add" className="action-button add-device">
                                        <FaTabletAlt className="icon"/>
                                        <span>Add New Device</span>
                                    </Link>
                                    <Link to="/librarian/reports" className="action-button generate-report">
                                        <FaChartBar className="icon"/>
                                        <span>Generate Reports</span>
                                    </Link>
                                </div>
                                
                            </div>
{/*                             
                            <div className="dashboard-bottom-row">
                           <div className="dashboard-section popular-section">
                                    <div className="section-header">
                                        <h2>Popular Books</h2>
                                    </div>
                                    
                                    <div className="popular-books">
                                        {popularBooks.slice(0, 5
                                        ).map((book, index) => (
                                            <div key={index} className="popular-book-item">
                                                <div className="book-rank">{index + 1}</div>
                                                <div className="book-info">
                                                    <h4>{book.Title}</h4>
                                                    <p>{book.Author_Name}</p>
                                                </div>
                                                <div className="book-checkouts">
                                                    <span className="checkouts-value">{book.checkout_count}</span>
                                                    <span className="checkouts-label">checkouts</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="view-all-link">
                                        <Link to="/librarian/reports">View full report</Link>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default LibrarianDashboard;