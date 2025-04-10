import React from "react";
import { useState } from "react";
import axios from 'axios';
import './LoginPage.css';

// Icon components to match Librarian Dashboard style
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="login-icon">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="login-icon">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const Login = () => {
    const [userID, setUserID] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // triggered when user submits the login form
    const handleSubmit = async(event) => {
        event.preventDefault(); // prevents the page from refreshing
        setIsLoading(true);
        setMessage('');

        const data = {
            userID,
            password
        };

        console.log("Attempting login with:", data);

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/login`, data);  // This one says "Login Successful or Invalid Password/ UserID"
            console.log("Login response:", res.data);

            // if token received and USER role
            if (res.data.token && res.data.role === 2) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("userRole", res.data.role);
                localStorage.setItem("userName", res.data.user);
                
                // Show success message
                setMessage({ type: 'success', text: res.data.message });
                
                // Redirect after a short delay
                setTimeout(() => {
                    // window.location.href = `/myBooks`;
                    window.location.href = `/browsebooks`;
                }, 1000);
            }

            // if token received and LIBRARIAN role
            else if (res.data.token && res.data.role === 1) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("userRole", res.data.role);
                localStorage.setItem("userName", res.data.user);
                
                // Show success message
                setMessage({ type: 'success', text: res.data.message });
                
                // Redirect after a short delay
                setTimeout(() => {
                    window.location.href = `/librarian`;
                }, 1000);
            } else {
                // Handle unexpected response format
                setMessage({ type: 'error', text: 'Received unexpected response from server' });
                console.error('Unexpected response:', res.data);
            }

        } catch (error) {
            console.error("Login error:", error);

            if (error.response && error.response.data && error.response.data.message) {
                setMessage({ type: 'error', text: error.response.data.message });
            } else {
                setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return(
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <img src="/logo.png" alt="Cougar Public Library Logo" className="login-logo" />
                    <h1>Cougar Library</h1>
                    <p>Secure Access Portal</p>
                </div>
                
                <form id="login_form" className="login-form" onSubmit={handleSubmit}>
                    {message && (
                        <div className={`login-message ${message.type}`}>
                            {message.text}
                        </div>
                    )}
                    
                    <div className="form-group">
                        <label htmlFor="userId" className="form-label">User ID</label>
                        <div className="input-with-icon">
                            <span className="input-icon"><UserIcon /></span>
                            <input 
                                id="userId"
                                type="text" 
                                className="form-input"
                                placeholder="Enter Your User ID"
                                value={userID} 
                                minLength={7}
                                maxLength={7}
                                onChange={(e) => setUserID(e.target.value)}
                                required
                            />
                        </div>
                        <p className="input-hint">Enter your unique library user ID</p>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <div className="input-with-icon">
                            <span className="input-icon"><LockIcon /></span>
                            <input 
                                id="password"
                                type="password" 
                                className="form-input"
                                placeholder="Enter Your Password"
                                value={password}
                                minLength={7}
                                maxLength={20}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    
                    <button 
                        type="submit" 
                        className={`login-button ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;