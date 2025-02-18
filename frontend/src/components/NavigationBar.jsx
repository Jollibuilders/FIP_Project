import { Link } from 'react-router-dom';
import profile from '../assets/user_logo.png';
import { useState } from "react";

const NavigationBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
        {/* profile to click on to cause drop down */}
        <div className="relative">
          <img
            src={profile}
            alt="Profile logo"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
        {/* drop down */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
            <div className='px-4 py-2 text-sm text-gray-700 border-b border-gray-200'>
            <p className='font-semibold'> Test user</p>
            <p className='text-xs text-gray-500'> test@gmail.com</p>
            </div>
            <Link to="/profile-setup" onClick={() => setDropdownOpen(false)}>
            <button className="w-full px-4 py-2 hover:bg-gray-100">
              Edit Profile
            </button>
            </Link>
            <Link to="/logout" onClick={() => setDropdownOpen(false)}>
            <button className="w-full px-4 py-2 hover:bg-gray-100">
              Log Out
            </button>
            </Link>
            </div>
        )}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
