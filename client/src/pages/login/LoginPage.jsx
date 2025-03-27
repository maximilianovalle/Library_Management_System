import React from "react";
import './LoginPage.css';
import { useState } from 'react'; // manages form inputs (ex: userID, password, message)
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

const Login = () => {
    
    const [userID, setUserID] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // const navigate = useNavigate();

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
            const res = await axios.post('https://library-management-system-gf9d.onrender.com/login', data);  // sends a POST request to /login w/ userID and password
            console.log("Login response:", res.data);

            // if token received and USER role
            if (res.data.token && res.data.role === 2) {
                localStorage.setItem("token", res.data.token);  // store token in frontend localStorage
                alert(res.data.message);
                window.location.href = `/account`;
            }

            // if token received and LIBRARIAN role
            else if (res.data.token && res.data.role === 1) {
                localStorage.setItem("token", res.data.token);  // store token in frontend localStorage
                alert(res.data.message);
                window.location.href = `/librarian`;
            } else {
                // Handle unexpected response format
                setMessage('Received unexpected response from server');
                console.error('Unexpected response:', res.data);
            }

        } catch (error) {
            console.error("Login error:", error);

            if (error.response && error.response.data && error.response.data.message) {
                setMessage(error.response.data.message);
            } else {
                setMessage('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };


    return(
        <div className="login">
            <h1>Welcome to Cougar Public Library</h1>
            <form id="login_form" onSubmit={handleSubmit}>  {/* triggers handleSubmit() */}
                <div className="input">
                    <div className="input_row">
                        <label>Username: {" "}
                            <input 
                                type="text" 
                                placeholder="Enter Username ..."
                                value={userID} 
                                minLength={7}
                                maxLength={7}
                                onChange={(e) => setUserID(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <div className="input_row">
                        <label>Password: {" "}
                            <input 
                                type="password" 
                                placeholder="Enter Password ..."
                                value={password}
                                maxLength={20}
                                minLength={7}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <button 
                        type="submit" 
                        className="login_button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                    {message && <p className="error-message">{message}</p>}
                </div>
            </form>

        </div>

    );
}

export default Login;