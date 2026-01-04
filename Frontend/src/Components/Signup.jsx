import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  
import axios from 'axios';
import '../Styles/Signup.css';

const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
    });

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.id]: event.target.value,
        });
    };

    const handleSignup = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/sign-up', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(response.data);
            navigate('/Login', { state: { message: 'Sign-up successful!' } });
        } catch (error) {
            console.error('Error during sign-up:', error.message);
        }
    };

    return (
        <div className="header">
            <div className="container-input">
                <h1>Sign Up</h1>
                <form onSubmit={handleSignup} method='POST' >
                    <input
                        id="first_name"
                        type="text"
                        placeholder="First Name"
                        required
                        value={formData.first_name}
                        onChange={handleChange}
                    />
                    <br />
                    <input
                        id="last_name"
                        type="text"
                        placeholder="Last Name"
                        required
                        value={formData.last_name}
                        onChange={handleChange}
                    />
                    <br />
                    <input
                        id="email"
                        type="email"
                        placeholder="Email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <br />
                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <br />
                    <p>
                        Already a member? <Link to="/Login">Log In</Link>
                    </p>
                    <button type="submit">Sign up</button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
