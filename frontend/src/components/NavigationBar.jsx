import { Link } from 'react-router-dom';
import profile from '../assets/user_logo.png';
import notificationBell from '../assets/notification.svg';

const NavigationBar = () => {
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
        <div className="flex items-center space-x-8">
          {/*
            <img src={notificationBell} className="w-8 h-8"></img>
            commented out for now as we don't use it
          */}
          <Link to="/profile-setup">
            <img
              src={profile}
              alt="Profile logo"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
