import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';

import HomePage from './pages/HomePage';
import TopListPage from './pages/TopListPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/top" element={<TopListPage />} />
            <Route path="/movies/:id" element={<MovieDetailsPage />} />
            <Route path="/user/:username" element={<ProfilePage />} />
            <Route path="/settings" element={<Protected><SettingsPage /></Protected>} />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
