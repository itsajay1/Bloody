import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  // Unified local auth state check
  const userInfoStr = localStorage.getItem('userInfo');
  const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const renderNavLink = (path, text) => {
    const active = location.pathname === path;
    const baseClasses = "px-4 py-2 rounded-lg font-medium transition-all duration-300 ease-in-out hover:-translate-y-0.5";
    const statusClasses = active 
      ? "bg-white/25 text-white shadow-md ring-1 ring-white/50" 
      : "text-white/90 hover:bg-white/10 hover:text-white";
      
    return (
      <Link to={path} className={`${baseClasses} ${statusClasses}`}>
        {text}
      </Link>
    );
  };

  return (
    <header className="bg-gradient-to-r from-red-700 via-red-600 to-red-800 shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-inner">
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-md cursor-pointer" onClick={() => navigate('/')}>
              Lifeline Connect
            </h1>
          </div>
          
          <nav className="flex space-x-2 sm:space-x-4 items-center">
            {renderNavLink('/', 'Home')}
            {renderNavLink('/request', 'Emergency Request')}
            
            {!userInfo ? (
              <>
                {renderNavLink('/login', 'Login')}
                <Link 
                  to="/register" 
                  className="px-5 py-2 rounded-lg font-bold transition-all duration-300 ease-in-out bg-white text-red-600 hover:bg-gray-100 hover:text-red-700 ml-2 hover:shadow-lg hover:-translate-y-0.5 ring-1 ring-white/50"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                {userInfo.role === 'donor' && renderNavLink('/profile', 'Dashboard')}
                {userInfo.role === 'hospital' && renderNavLink('/hospital-dashboard', 'Hospital Panel')}
                <NotificationBell />
                <button 
                  onClick={handleLogout} 
                  className="px-4 py-2 rounded-lg font-medium transition-all duration-300 ease-in-out text-white/90 hover:bg-white/10 hover:text-white hover:-translate-y-0.5"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
