import profile from '../assets/user_logo.png';

const NavigationBar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <a href="/home" className="flex items-center space-x-2">
          <img
            src="../../public/jollibuilders.png"
            alt="Jollibuilders FIP logo"
            className="w-8 h-8 sm:w-10 sm:h-10"
          />
          <h1 className="text-base sm:text-lg font-medium text-gray-900">
            Job <span className="text-gray-600">Connector</span>
          </h1>
        </a>
        <a href="/account">
          <img
            src={profile}
            alt="Profile logo"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
          />
        </a>
      </div>
    </nav>
  );
};

export default NavigationBar;
