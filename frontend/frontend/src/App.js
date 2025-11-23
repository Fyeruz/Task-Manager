import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Login';
import TaskList from './TaskList';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (token && userId) {
      setUser({ token, userId });
    }
    setLoading(false);
  }, []);

  const handleLogin = (token, userId) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    setUser({ token, userId });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Task Manager</h1>
        {user && (
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        )}
      </header>
      
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <TaskList user={user} />
      )}
    </div>
  );
}

export default App;