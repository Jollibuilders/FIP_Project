import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from "react";
import { auth } from "../firebase";
import { getAuth } from 'firebase/auth';

import { LuPencil, LuLogOut, LuArrowRightFromLine, LuArrowLeftFromLine } from "react-icons/lu";
import { IoMdHome, IoMdNotifications } from "react-icons/io";
import { IoPersonCircle } from "react-icons/io5";
import { MdPeopleAlt } from "react-icons/md";
import { TbMessageCircleFilled } from "react-icons/tb";
import { FaQuestion } from "react-icons/fa6";

const NavigationBar = ({ navbarWidth, setNavbarWidth }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const dropdownRef = useRef(null)
  const [user, setUser] = useState(null);
  const [name, setName] = useState(null);
  const navigate = useNavigate();

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
            console.log("Getting user successful:", data);
        } else {
          console.error("Getting user failed:", data.message);
        }
    } catch (error) {
      console.error("Getting user failed:", error);
    }
  }

  const handleOpenCloseNavBar = () => {
    if(navbarOpen) {
      setNavbarWidth(80)
      setNavbarOpen(false);
    } else {
      setNavbarWidth(256)
      setNavbarOpen(true);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user)=> {
      setUser(user);
      if (user) {
        getCurrentPerson(user);
      }
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

  const NavItem = ({ to, icon: Icon, label }) => (
    <div className={`${!navbarOpen ? 'pointer-events-none' : ''}`}>
      <Link to={to} className="flex flex-row items-center text-base font-bold text-[#3D270A]">
        <Icon className="mr-4 h-8 w-8" />
        {navbarOpen && <span className="text-base font-bold">{label}</span>}
      </Link>
    </div>
  );

  return (
    <nav className={`fixed top-0 left-0 h-full bg-white shadow-sm flex flex-col py-6 transition-width duration-200 ${navbarOpen ? 'w-64' : 'w-20'}`}>
      {/* profile and notification */}
      <div className="flex flex-col">
        <div className="flex flex-row items-center px-5 pb-6 space-x-4 flex-shrink-0" ref={dropdownRef}>
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="Profile logo"
            className={`w-10 h-10 rounded-full cursor-pointer ${!navbarOpen ? 'pointer-events-none' : ''}`}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
        ) : (
          <IoPersonCircle
            className={`w-10 h-10 text-[#3D270A] cursor-pointer ${!navbarOpen ? 'pointer-events-none' : ''}`}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
        )}
          {navbarOpen && (
            <span className="text-base font-bold text-[#3D270A]" onClick={() => setDropdownOpen(!dropdownOpen)}>
              {name}
            </span>
        )}
          {dropdownOpen && (
            <div className="absolute left-20 mt-20 mb-2 w-52 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              <div className='px-4 py-2 text-sm text-gray-700 border-b border-gray-200'>
                <p className="font-semibold">{user?.displayName || 'User Name'}</p>
                <p className="text-sm text-gray-500">{user?.email || 'user@example.com'}</p>
              </div>
              <Link to="/profile-setup" onClick={() => setDropdownOpen(false)}>
                <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 border-b border-gray-200">
                  <LuPencil className="w-5 h-5" />
                  <span>Edit Profile</span>
                </button>
              </Link>
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

        <div className="flex items-center mb-10 text-[#3D270A]">
          <IoMdNotifications className={`h-8 w-8 ${navbarOpen ? 'mr-4 ml-6' : 'mx-auto'}`} />
          {navbarOpen && <span className="text-base font-bold">Notifications</span>}
        </div>
      </div>

      {/* border between profile/notification and links */}
      <div className="border-b-2 border-[#3D270A] w-7/8 mx-auto"></div>

      {/* navigation links */}
      <div className="flex flex-col items-start space-y-6 px-6 mt-6">
        <NavItem to="/home" icon={IoMdHome} label="Home" />
        <NavItem to="/matches" icon={MdPeopleAlt} label="Network" />
        <NavItem to="/chat" icon={TbMessageCircleFilled} label="Messages" />
        <NavItem to="/faq" icon={FaQuestion} label="FAQ" />
      </div>

      <div className="flex-grow"></div>

      <button className={`flex flex-row w-full px-4 ${navbarOpen ? 'justify-end' : 'justify-center'}`} onClick={() => handleOpenCloseNavBar()}>
        {navbarOpen ? <LuArrowLeftFromLine className='h-5 w-5'/> : <LuArrowRightFromLine className='h-5 w-5'/>}
      </button>

    </nav>
  );
};

export default NavigationBar;