import { Link } from 'react-router-dom';
import profile from '../assets/user_logo.png';
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'; 
import { auth } from "./firebase"; 

const NavigationBar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => 
  {
    const unsubscribe = auth.onAuthStateChanged((user) => 
      {
        setUser(user);
      });
      return () => unsubscribe();
  }, []);

  const handleLogout = async () => 
  {
    try 
    {
      await signOut(auth);
      console.log("User logged out");
      setUser(null);
    } 
    catch (err) 
    {
      console.error('Error logging out:', err);
    }
  };

  const handleEdit = () =>
    {
      navigate('/profile-setup');
    }

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/home" className="flex items-center space-x-2">
          <img
            src="../../public/jollibuilders.png"
            alt="Jollibuilders FIP logo"
            className="w-8 h-8 sm:w-10 sm:h-10"
          />
          <h1 className="text-base sm:text-lg font-bold text-gray-900">
            Job Connector
          </h1>
        </Link>
        <Link to="/profile-setup">
          <img
            src={profile}
            alt="Profile logo"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
          />
        </Link>
      </div>
    </nav>
  );
};

export default NavigationBar;
