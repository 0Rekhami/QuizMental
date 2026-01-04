import React from 'react';
import ReactDOM from 'react-dom';
import App from './Components/App';
import './Styles/index.css';
import { AuthProvider } from './Components/AuthContext';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
