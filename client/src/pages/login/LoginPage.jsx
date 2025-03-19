import React from "react";
import './LoginPage.css';
import {useState} from 'react'
const Login = () => {
    const [userID, setUserID] = useState('');
    const [password, setPassword] = useState("");
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
                    <button className= "login_button">Login</button>
                    
                </div>
            </form>

        </div>

    );
}

export default Login