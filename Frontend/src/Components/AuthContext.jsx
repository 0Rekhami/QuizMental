// AuthContext.js
import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('accessToken') ? true : false;
  });


  const login = (token, userId) => {
    console.log('Setting token and userId:', token, userId);

    if (userId !== undefined) {
      setIsAuthenticated(true);
      sessionStorage.setItem('accessToken', token);
      sessionStorage.setItem('userId', String(userId)); 
    } else {
      console.error('Error: userId is undefined');
    }
  };
  
  const [userId, setUserId] = useState(() => {
    const storedUserId = sessionStorage.getItem('userId');
    if (storedUserId) {
      return parseInt(storedUserId); 
    } else {
      console.log('userId not found in sessionStorage');
      return null;
    }
  });

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('userId'); 
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
