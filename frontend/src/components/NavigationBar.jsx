import { Link, useNavigate } from 'react-router-dom';
import profile from '../assets/user_logo.png';
import { useState, useEffect, useRef } from "react";
import { auth } from "../firebase";
import { LuPencil, LuLogOut } from "react-icons/lu";

const NavigationBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null)
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user)=> {
    setUser(user);
    });
    return () => unsubscribe();
  }, [])
  {/* effect to cause dropsown to close when click off it*/}
  useEffect(() => {
    const handleclickout = (event) => {
      if(dropdownRef.current && !dropdownRef.current.contains(event.target)){
        setDropdownOpen(false)
      }
    };
    document.addEventListener("mousedown", handleclickout)
    document.addEventListener("touchstart", handleclickout)
    return () => {
      document.removeEventListener("mousedown", handleclickout)
      document.removeEventListener("touchstart", handleclickout)
  };
},[]);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm">
      {/* other logos on nav bar */}
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
        <div className="flex flex-row items-center space-x-10">
          <Link to="/matches" className="text-base sm:text-md font-bold text-gray-900">
            Matches
          </Link>
          <Link to="/faq" className="text-base sm:text-md font-bold text-gray-900">
            FAQ
          </Link>
          {/* profile to click on to cause drop down */}
          <div className="relative" ref={dropdownRef}>
            <img
              src={user?.photoURL || profile}
              alt="Profile logo"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {/* drop down */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-300 rounded-lg shadow-lg">
                <div className='px-4 py-2 text-sm text-gray-700 border-b border-gray-200'>
                  <p className="font-semibold">{user?.displayName || 'User Name'}</p>
                  <p className="text-sm text-gray-500">{user?.email || 'user@example.com'}</p>
                </div>
                {/* edit profile button */}
                <Link to="/profile-setup" onClick={() => setDropdownOpen(false)}>
                  <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 border-b border-gray-200">
                    <LuPencil className="w-5 h-5" />
                    <span>Edit Profile</span>
                  </button>
                </Link>
                {/* log out button*/}
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    auth.signOut()
                      .then(() => navigate("/logout"))
                      .catch((error) => console.error("Logout failed:", error));
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                >
                  <LuLogOut className="w-5 h-5" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;