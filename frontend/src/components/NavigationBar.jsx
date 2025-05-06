import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from "react";
import { auth } from "../firebase";
import { getAuth } from 'firebase/auth';

import { LuPencil, LuLogOut } from "react-icons/lu";
import { IoMdHome } from "react-icons/io";
import { IoPersonCircle } from "react-icons/io5";
import { MdPeopleAlt } from "react-icons/md";
import { TbMessageCircleFilled } from "react-icons/tb";
import { FaQuestion } from "react-icons/fa6";
import { FaHandshake } from "react-icons/fa";

const NavigationBar = ({ navbarWidth, setNavbarWidth }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [user, setUser] = useState(null);
  const [name, setName] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentPerson = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("User not authenticated.");
      return;
    }

    try {
      const token = await user.getIdToken();
      const response = await fetch("http://localhost:3000/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        if (data.message !== "User does not exist") {
          setName(data.fullName);
        }
      } else {
        console.error("Getting user failed:", data.message);
      }
    } catch (error) {
      console.error("Getting user failed:", error);
    }
  };

  useEffect(() => {
    if (setNavbarWidth) {
      setNavbarWidth(256);
    }
  }, [setNavbarWidth]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        getCurrentPerson(user);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const NavItem = ({ to, icon: Icon, label }) => {
    // Determine if this link is active
    const isActive = location.pathname === to;
    
    return (
      <Link 
        to={to} 
        className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 
          ${isActive ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}`}
      >
        <Icon className={`mr-3 h-6 w-6 ${isActive ? 'text-black' : 'text-gray-700'}`} />
        <span className={`text-sm ${isActive ? 'font-semibold text-black' : 'font-medium text-gray-800'}`}>{label}</span>
      </Link>
    );
  };

  return (
    <nav 
      className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg flex flex-col py-6 z-10"
      aria-label="Main navigation"
    >
      {/* Profile Section */}
      <div className="flex flex-col mb-6">
        <div className="flex items-center px-6" ref={dropdownRef}>
          <div 
            className="relative cursor-pointer group"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-10 h-10 rounded-full border border-gray-200 transition-all group-hover:ring-2 group-hover:ring-gray-300"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center transition-all group-hover:bg-gray-200">
                <IoPersonCircle className="w-8 h-8 text-gray-800" />
              </div>
            )}
          </div>
          
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-medium text-gray-800 truncate">{name || "User"}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
          </div>
          
          {dropdownOpen && (
            <div className="absolute top-16 left-6 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <p className="font-medium text-gray-800">{user?.displayName || name || 'User'}</p>
                <p className="text-sm text-gray-600 truncate">{user?.email || ''}</p>
              </div>
              
              <Link to="/profile-setup" onClick={() => setDropdownOpen(false)}>
                <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
                  <LuPencil className="w-5 h-5 text-gray-700" />
                  <span className="text-sm text-gray-800">Edit Profile</span>
                </div>
              </Link>
              
              <div 
                onClick={() => {
                  setDropdownOpen(false);
                  auth.signOut()
                    .then(() => navigate("/logout"))
                    .catch((error) => console.error("Logout failed:", error));
                }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-t border-gray-100 transition-colors"
              >
                <LuLogOut className="w-5 h-5 text-gray-700" />
                <span className="text-sm text-gray-800">Log Out</span>
                </div>
              </div>
            )}
          </div>
        </div>

      {/* Divider */}
      <div className="border-b border-gray-200 w-5/6 mx-auto mb-6"></div>

      {/* Navigation Links */}
      <div className="flex flex-col px-2 space-y-2">
        <div className="mb-1 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
          Main
        </div>
        <NavItem to="/home" icon={IoMdHome} label="Home" />
        
        <div className="mt-4 mb-1 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
          Connect
        </div>
        <NavItem to="/matches" icon={MdPeopleAlt} label="Network" />
        <NavItem to="/match" icon={FaHandshake} label="Match" />
        <NavItem to="/chat" icon={TbMessageCircleFilled} label="Messages" />
        
        <div className="mt-4 mb-1 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
          Help
        </div>
        <NavItem to="/faq" icon={FaQuestion} label="FAQ" />
      </div>
    </nav>
  );
};

export default NavigationBar;