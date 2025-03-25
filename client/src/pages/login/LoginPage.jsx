import React from "react";
import './LoginPage.css';
import { useState } from 'react'; // manages form inputs (ex: userID, password, message)
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

const Login = () => {
    
    const [userID, setUserID] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    // const navigate = useNavigate();

    // triggered when user submits the login form
    const handleSubmit =  async(event) => {
        event.preventDefault(); // prevents the page from refreshing

        const data = {
            userID,
            password
        };

        console.log(data);

        try {
            const res = await axios.post('https://library-management-system-gf9d.onrender.com/login', data);  // sends a POST request to /login w/ userID and password

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
            }

        } catch (error) {
            console.log(error);

            if (error.response && error.response.data && error.response.data.message) {
                setMessage(error.response.data.message);
            } else {
                setMessage('An unexpected error occurred');
            }
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
                    <button type="submit" className="login_button">Login</button>
                    {message && <p>{message}</p>}
                </div>
            </form>

        </div>

    );
}

export default Login