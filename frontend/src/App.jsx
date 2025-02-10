import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import ProfileSetup from './ProfileSetup';
import NavigationBar from './components/NavigationBar';
import Match from './pages/Match';
import './App.css';

// Layout for pages that should include the NavigationBar.
const AppLayout = () => (
  <>
    <NavigationBar />
    <Outlet />
  </>
);

function App() {
  return (
    <Routes>
      {/* Public Routes: Login and Signup will render without NavigationBar */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Protected Route: profile-setup can only be accessed by signed up users */}
      <Route
        path="/profile-setup"
        element={
          <ProtectedRoute>
            <ProfileSetup/>
          </ProtectedRoute>
        }
      />
      {/* Routes wrapped with AppLayout will have the NavigationBar */}
      <Route element={<AppLayout />}>
        {/* Redirect root to /home */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/match"
          element={
            <ProtectedRoute>
              <Match />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/signup" replace />} />
    </Routes>
  );
}

export default App;
