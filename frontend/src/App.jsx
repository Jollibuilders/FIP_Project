import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import SelectRole from './pages/SelectRole';
import ProtectedRoute from './components/ProtectedRoute';
import ProfileSetup from './ProfileSetup';
import NavigationBar from './components/NavigationBar';
import ChatPage from './pages/Chat';
import Match from './pages/Match';
import Matches from './pages/Matches';
import FAQPage from './pages/FAQPage';
import './App.css';

// Layout for pages that should include the NavigationBar.
const AppLayout = () => (
  <div className="flex">
    <div className="w-64">
      <NavigationBar />
    </div>

    <div className="flex-grow">
      <Outlet />
    </div>
  </div>
);

function App() {
  return (
    <Routes>
      {/* Public Routes: Login and Signup will render without NavigationBar */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />


      <Route
        path="/select-role"
        element={
          <ProtectedRoute>
            <SelectRole />
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
              <Home/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/match"
          element={
            <ProtectedRoute>
              <Match/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/matches"
          element={
            <ProtectedRoute>
              <Matches/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile-setup"
          element={
            <ProtectedRoute>
              <ProfileSetup/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/faq"
          element={
            <ProtectedRoute>
              <FAQPage/>
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
