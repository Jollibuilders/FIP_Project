import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import ProfileSetup from './ProfileSetup';
import './App.css'

function App() {
  return (
    <Routes>
      {/* Redirect root to /signup */}
      <Route path="/" element={<Navigate to="/signup" replace />} />

      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Protected Route: Home can only be accessed by signed up users */}
      <Route
        path="/profile-setup"
        element={
          <ProtectedRoute>
            <ProfileSetup/>
          </ProtectedRoute>
        }
      />
      
      {/* Protected Route: Home can only be accessed by logged-in users */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* Optionally, add a fallback route */}
      <Route path="*" element={<Navigate to="/signup" replace />} />
    </Routes>
  );
}

export default App;
