import React from "react";
import './LoginPage.css';
import {useState, useEffect} from 'react';
import axios from 'axios';


const Login = () => {
    const [userID, setUserID] = useState('');
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState('');


    const handleSubmit = async () => {
        try {
            const response =
            await axios.post('http://localhost:8000/login', { userID, password }).then((response) => {
                console.log(response);
            }
            );
            if (response.status === 200) {
                setMessage('Login successful');
            }
        }
        catch (error) {
            console.log(error);
            setMessage('Invalid user ID or password');
        }
    };
    return(
        <div className="login">
            <h1>Welcome to Cougar Public Library</h1>
            <form>
                <div className="input">
                    <div className = "input_row">
                        <label>Username: </label>
                        <input 
                            type = "user ID" 
                            placeholder= "Enter Username ..."
                            value = {userID} 
                            minLength={7}
                            maxLength={7}
                            onChange ={(e) => setUserID(e.target.value)}
                            required
                        />
                    </div>
                    <div className = "input_row">
                        <label>Password: </label>
                        <input 
                            type = "Password" 
                            placeholder= "Enter Password ..."
                            value = {password}
                            maxLength={20}
                            minLength={7}
                            onChange = {(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className= "login_button" onClick= {handleSubmit}>Login</button>
                    {message && <p>{message}</p>}
                    
                </div>
            </form>

        </div>

    );
}

export default Login