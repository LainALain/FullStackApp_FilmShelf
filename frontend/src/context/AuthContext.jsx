// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // При загрузке проверяем localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ token, username });
    }
  }, []);

  async function login(email, password) {
    const { data } = await axios.post('/auth/login', { email, password });
    // data = { token, user: { id, username } }
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.user.username);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser({ token: data.token, username: data.user.username });
  }

  async function register(username, email, password) {
    const { data } = await axios.post('/auth/register', { username, email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.user.username);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser({ token: data.token, username: data.user.username });
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
