import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
<<<<<<< HEAD
import ProfileSetup from './ProfileSetup';
import './App.css'
=======
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
>>>>>>> 7c06735661ae423e4df1ec0e2d1fa84aac85345a

function App() {
  return (
    <Routes>
      {/* Public Routes: Login and Signup will render without NavigationBar */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

<<<<<<< HEAD
      {/* Protected Route: profile-setup can only be accessed by signed up users */}
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
=======
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
>>>>>>> 7c06735661ae423e4df1ec0e2d1fa84aac85345a

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/signup" replace />} />
    </Routes>
  );
}

export default App;
