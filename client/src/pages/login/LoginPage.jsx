import React from "react";
import './LoginPage.css';
import {useState} from 'react';
import axios from 'axios';
import {useNavigate} from  'react-router-dom';


const Login = () => {

    const [userID, setUserID] = useState('');
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit =  async(event) => {
        event.preventDefault();

        const data = {
            userID,
            password
        };
        console.log(data);

        try {

            const res = await axios.post('http://localhost:8000/login', data);
            
            if (res.status === 200) {
                setMessage(res.data.message);
                navigate('/user');
            } 
            else {
                setMessage(res.data.message || 'Login failed');
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
            <form id="login_form" onSubmit={handleSubmit}>
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