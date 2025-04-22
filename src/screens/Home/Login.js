import React, { useState ,useContext} from 'react';
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { PlaygroundContext } from '../../context/PlaygroundContext';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const navigate = useNavigate(); // Hook for navigation

    const login = async (e) => {
        e.preventDefault(); // Prevent default form submission
        const response = await fetch('http://localhost:5000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password }) // Pass username and password
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token); // Store the token in local storage
            navigate('/Editor/:folderId/:playgroundId'); // Redirect to the dashboard on successful login
        } else {
            const errorMessage = await response.text();
            alert(`Login failed: ${errorMessage}`); // Display error message
        }
    };

    return (
        <div>
            <div className="container">
                <div className="card card-login mx-auto text-center bg-dark">
                    <div className="card-header mx-auto bg-dark">
                        <span>
                            <img style={{ height: "70px" }} src="https://nsearchives.nseindia.com/web/sites/default/files/2019-07/NSE%404x-100.jpg" alt="Logo" />
                        </span>
                        <br />
                        <span className="logo_title mt-5"> Login Dashboard </span>
                    </div>
                    <div className="card-body">
                        <form onSubmit={login} method="post"> {/* Use login function on form submission */}
                            <div className="input-group form-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><i className="fas fa-user"></i></span>
                                </div>
                                <input 
                                    type="text" 
                                    name="email" 
                                    className="form-control" 
                                    placeholder="Username" 
                                    value={username} 
                                    onChange={(e) => setUsername(e.target.value)} // Update username state
                                    required
                                />
                            </div>

                            <div className="input-group form-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><i className="fas fa-key"></i></span>
                                </div>
                                <input 
                                    type="password" 
                                    name="password" 
                                    className="form-control" 
                                    placeholder="Password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} // Update password state
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <input 
                                    type="submit" 
                                    name="btn" 
                                    value="Login" 
                                    className="btn btn-outline-danger float-right login_btn"
                                />
                            </div>
                            <p style={{ color: "white", fontSize: "13px" }}>
                                Don't have an account? <Link to="/signup">Sign up here</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;