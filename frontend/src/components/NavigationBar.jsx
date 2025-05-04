import { Link, useNavigate } from 'react-router-dom';
import profile from '../assets/user_logo.png';
import { useState, useEffect, useRef } from "react";
import { auth } from "../firebase";
import { getAuth } from 'firebase/auth';

import { LuPencil, LuLogOut } from "react-icons/lu";
import { IoMdHome, IoMdNotifications } from "react-icons/io";
import { MdCoffee } from "react-icons/md";
import { MdPeopleAlt } from "react-icons/md";
import { TbMessageCircleFilled } from "react-icons/tb";
import { FaQuestion } from "react-icons/fa6";

const NavigationBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user)=> {
    setUser(user);
    });
    getCurrentPerson();
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
    <nav className="fixed top-0 left-0 h-full w-64 bg-white shadow-sm flex flex-col py-6">
      {/* profile and notification */}
      <div className="flex flex-col">
        <div className="flex flex-row items-center px-6 pb-6" ref={dropdownRef}>
          <img
            src={user?.photoURL || profile}
            alt="Profile logo"
            className="w-8 h-8 mr-4 rounded-full cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          <span className="text-base font-bold text-black" onClick={() => setDropdownOpen(!dropdownOpen)}>
            {name}
          </span>
          {dropdownOpen && (
            <div className="absolute left-16 mt-20 mb-2 w-52 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
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

        <div className="flex flex-row items-center px-6 mb-10 text-[#3D270A]">
          <IoMdNotifications className="mr-4 h-8 w-8"/>
          <span className="text-base font-bold">Notifications</span>
        </div>
      </div>

      {/* border between profile/notification and links */}
      <div className="border-b-2 border-[#3D270A] w-7/8 mx-auto"></div>

      {/* navigation links */}
      <div className="flex flex-col space-y-6 px-6 mt-6">
        <Link to="/home" className="flex flex-row items-center text-base font-bold text-[#3D270A]">
          <IoMdHome className="mr-4 h-8 w-8"/>
          Home
        </Link>
        <Link to="/matches" className="flex flex-row items-center text-base font-bold text-[#3D270A]">
          <MdPeopleAlt className="mr-4 h-8 w-8"/>
          Network
        </Link>
        <Link to="/chat" className="flex flex-row items-center text-base font-bold text-[#3D270A]">
          <TbMessageCircleFilled className="mr-4 h-8 w-8"/>
          Messages
        </Link>
        <Link to="/faq" className="flex flex-row items-center text-base font-bold text-[#3D270A]">
          <FaQuestion className="mr-4 h-8 w-8"/>
          FAQ
        </Link>
      </div>

    </nav>
  );
};

export default NavigationBar;