import React from "react";
import './LoginPage.css';
import {useState} from 'react';
import axios from 'axios';
import {useNavigate} from  'react-router-dom';


const Login = () => {
    // let axiosConfig = {
    //     headers: {
    //         'Content-Type': 'application/json;charset=UTF-8',
    //         "Access-Control-Allow-Origin": "*",
    //     }
    //   };
    const [userID, setUserID] = useState('');
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState('');
    const navigate = useNavigate();


    const handleSubmit =  async(event) => {
        event.preventDefault();
        const data = {
            User_ID: userID,
            Password: password
        };

        try {
            const res = await axios.post('http://localhost:8000/login', data, {
                headers: { 'Content-Type': 'application/json' },
            });
            
            if (res.status === 200) {
                setMessage(res.data.message)
                navigate('/user');
            }
            else {
                setMessage("login failed");
            }


            // e.preventDefault();
            // axios.get('http://localhost:8000/login')
            // .then((res) => {
            //     console.log(res.message);
            //     <Link to = "/home"/>
            // }).catch((err) => {
            //     console.log(err);
            // })
            // const response =
            // await axios.post('http://localhost:8000/login', { userID, password }, axiosConfig)
            // if (response.status === 200) {
            //     setMessage(response.message);
            //     <Link to = "/home"/>
            // }
        }
        catch (error) {
            console.log(error);
            setMessage('Invalid user ID or password');
        }
    };
    return(
        <div className="login">
            <h1>Welcome to Cougar Public Library</h1>
            <form id = "login_form">
                <div className="input">
                    <div className = "input_row">
                        <label>Username: {" "} 
                        <input 
                            type = "text" 
                            placeholder= "Enter Username ..."
                            value = {userID} 
                            minLength={7}
                            maxLength={7}
                            onChange ={(e) => setUserID(e.target.value)}
                            required
                            />
                        </label>
                    </div>
                    <div className = "input_row">
                        <label> Password: {" "} 
                            <input 
                                type = "text" 
                                placeholder= "Enter Password ..."
                                value = {password}
                                maxLength={20}
                                minLength={7}
                                onChange = {(e) => setPassword(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <button type= "submit" className= "login_button" onClick= {handleSubmit}>Login</button>
                    {message && <p>{message}</p>}
                    
                </div>
            </form>

        </div>

    );
}

export default Login