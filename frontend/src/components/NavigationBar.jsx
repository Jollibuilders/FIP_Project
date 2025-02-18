import { Link } from 'react-router-dom';
import profile from '../assets/user_logo.png';
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'; 
import { auth } from "./firebase"; 
import { signOut } from 'firebase/auth';

const NavigationBar = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => 
  {
    const unsubscribe = auth.onAuthStateChanged((user) => 
      {
        setUser(user);
      });
      return () => unsubscribe();
  }, []);

  useEffect(() => 
  {
    const handleClickOutside = (event) =>
    {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) 
      {
        setDropdownOpen(false);  
      }
    };
  
    if (dropdownOpen) 
    {
      document.addEventListener('mousedown', handleClickOutside);  
    } 
    else 
    {
      document.removeEventListener('mousedown', handleClickOutside);  
    }
  
    return () => document.removeEventListener('mousedown', handleClickOutside);  
  }, [dropdownOpen]);

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
        <button onClick={() => setDropdownOpen(!dropdownOpen)}>
          <img
              src="../../public/jollibuilders.png"
              alt="Jollibuilders FIP logo"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
          />
        </button>
        {dropdownOpen && (
          <div ref={dropdownRef} className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b">
              <p className="font-semibold">{user?.displayName || 'User Name'}</p>
              <p className="text-sm text-gray-500">{user?.email || 'user@example.com'}</p>
            </div>
            <button
              onClick={handleEdit}
              className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-100"
            >
              <span>Edit Profile</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 border-t"
            >
              <span>Log out</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;
