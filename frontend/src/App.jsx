import { useState, React } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import SelectRole from './pages/SelectRole';
import ProtectedRoute from './components/ProtectedRoute';
import ProfileSetup from './ProfileSetup';
import NavigationBar from './components/NavigationBar';
import ChatPage from './pages/Chat';
import Match from './pages/Match';
import Matches from './pages/Matches';
import FAQPage from './pages/FAQPage';
import ProfilePage from './pages/ProfilePage'; 
import './App.css';
import Onboarding from "./pages/Onboarding.jsx";

// Layout for pages that should include the NavigationBar.
const AppLayout = ({ navbarWidth, setNavbarWidth }) => (
  <div className="flex">
    <div style={{ width: `${navbarWidth}px` }} className="z-10">
      <NavigationBar navbarWidth={navbarWidth} setNavbarWidth={setNavbarWidth} />
    </div>

    {/* Content area adjusts based on navbar width */}
    <div className="flex-grow">
      <Outlet />
    </div>
  </div>
);

function App() {
  const [navbarWidth, setNavbarWidth] = useState(80);
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

      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />

      {/* Routes wrapped with AppLayout will have the NavigationBar */}
      <Route element={<AppLayout navbarWidth={navbarWidth} setNavbarWidth={setNavbarWidth}/>}>
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
        <Route
          path="profile/:id"
          element={
            <ProtectedRoute>
              <ProfilePage/>
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
