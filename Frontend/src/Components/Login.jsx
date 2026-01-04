import "../Styles/Signup.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const Login = ({}) => {
  const { isAuthenticated,login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    const { state } = location;
    const messageParam = state?.message || null;
    setMessage(messageParam);
  }, [location.state]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/Login', formData);
      console.log(response.data);

      if (response.data.message === 'Login successful') {
        const token  = response.data.token;
        console.log(token)
        const userData = response.data.user; 
        const userId = userData.id;
        console.log(userId) 
        login(token,userId);
        const serializedUserData = JSON.stringify(userData);
        sessionStorage.setItem('userData', serializedUserData);
        navigate(to="/Home")

       

      } else {
        setMessage(response.data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      setMessage('An error occurred during login');
    }
  };
  console.log(isAuthenticated);
  return (
    <div className="header">
      <div className="container-input">
        <h1>Log In</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <br />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
          />
          <br />
          <p>
            Not a member? <Link to="/Signup">Sign up</Link>
          </p>
          <button type="submit">Log In</button>
          {message && <h6>{message}</h6>}
        </form>
      </div>
    </div>
  );
};
export default Login;
