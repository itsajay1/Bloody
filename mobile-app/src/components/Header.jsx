import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import { useAuth } from '../context/AuthContext';

function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsSidebarOpen(false);
    navigate('/login');
  };

  const BloodDropIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c-4.42 0-8 3.58-8 8 0 5.42 7.17 11.42 7.48 11.67.15.12.33.18.52.18s.37-.06.52-.18c.31-.25 7.48-6.25 7.48-11.67 0-4.42-3.58-8-8-8z" />
    </svg>
  );

  const renderNavLink = (path, text, mobile = false) => {
    const active = location.pathname === path;
    const baseClasses = mobile 
      ? "w-full flex items-center px-6 py-5 text-lg font-black tracking-tight transition-all duration-300" 
      : "px-3 py-1.5 rounded-xl text-sm font-black transition-all duration-300 transform hover:-translate-y-0.5";
    
    const statusClasses = active 
      ? mobile ? "bg-red-50 text-red-600 border-r-4 border-red-600" : "bg-red-50 text-red-600 shadow-sm border border-red-100" 
      : mobile ? "text-gray-400 hover:text-gray-900 hover:bg-gray-50" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900";
      
    return (
      <Link to={path} onClick={() => setIsSidebarOpen(false)} className={`${baseClasses} ${statusClasses}`}>
        {text}
      </Link>
    );
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 md:pt-6 transition-all duration-300 pointer-events-none">
        <div className="mx-auto max-w-7xl glass rounded-3xl shadow-premium border border-white/60 flex justify-between items-center h-16 md:h-20 px-6 md:px-10 bg-white/70 backdrop-blur-2xl pointer-events-auto">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="w-10 h-10 md:w-11 md:h-11 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20 transform transition-all group-hover:scale-105 group-hover:rotate-3">
              <BloodDropIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tighter">
              Lifeline<span className="text-red-600">Connect</span>
            </h1>
          </div>
          
          {/* Desktop Navigation (Visible on wider mobile screens in landscape or tablets) */}
          <nav className="hidden lg:flex space-x-2 items-center">
            {renderNavLink('/', 'Home')}
            {renderNavLink('/request', 'Emergency')}
            
            {!user ? (
              <div className="flex items-center space-x-2">
                {renderNavLink('/login', 'Login')}
                <Link 
                  to="/register" 
                  className="px-5 py-1.5 rounded-xl font-black transition-all duration-300 bg-gray-900 text-white hover:bg-red-600 shadow-lg transform hover:-translate-y-0.5 text-xs uppercase tracking-widest"
                >
                  Join
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                {user.role === 'donor' && renderNavLink('/profile', 'Dashboard')}
                <NotificationBell />
                <button 
                  onClick={handleLogout} 
                  className="px-4 py-2 rounded-xl font-bold transition-all duration-300 text-gray-500 hover:bg-red-50 hover:text-red-600 text-xs sm:text-sm"
                >
                  Logout
                </button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Toggle (Primary on Mobile App) */}
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="flex p-2 rounded-xl bg-gray-50 text-gray-500 hover:text-red-600 transition-colors pointer-events-auto"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </header>

      {/* Sidebar Overlay */}
      <div 
        className={`fixed inset-0 z-[60] bg-gray-900/60 backdrop-blur-sm transition-opacity duration-500 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar Drawer */}
      <div className={`fixed top-0 left-0 bottom-0 z-[70] w-72 glass-dark shadow-2xl transition-transform duration-500 ease-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center">
              <BloodDropIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-black tracking-tighter text-xl">Lifeline</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="text-white/40 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-grow pt-8">
          <div className="px-6 mb-6">
            <p className="text-[10px] font-black uppercase text-white/30 tracking-[0.2em]">Primary Navigation</p>
          </div>
          {renderNavLink('/', 'Home Experience', true)}
          {renderNavLink('/request', 'Emergency Broadcast', true)}
          
          {!user ? (
            <div className="mt-8 px-6 space-y-4">
              <Link onClick={() => setIsSidebarOpen(false)} to="/login" className="block w-full text-center py-4 rounded-2xl border border-white/20 text-white font-black text-sm hover:bg-white/10 transition-all uppercase tracking-widest">Login</Link>
              <Link onClick={() => setIsSidebarOpen(false)} to="/register" className="block w-full text-center py-4 rounded-2xl bg-red-600 text-white font-black text-sm shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all uppercase tracking-widest">Join Identity</Link>
            </div>
          ) : (
            <div className="mt-8 space-y-2">
              <div className="px-6 mb-4">
                <p className="text-[10px] font-black uppercase text-white/30 tracking-[0.2em]">Profile Access</p>
              </div>
              {user.role === 'donor' && renderNavLink('/profile', 'Hero Dashboard', true)}
              <div className="px-6 py-4 flex items-center justify-between">
                 <span className="text-white/60 font-bold text-sm">Notifications</span>
                 <NotificationBell />
              </div>
              <button 
                onClick={handleLogout} 
                className="w-full flex items-center px-6 py-5 text-gray-400 font-bold hover:text-red-500 hover:bg-red-500/5 transition-all text-left"
              >
                Terminate Session
              </button>
            </div>
          )}
        </nav>

        <div className="p-8 border-t border-white/10">
          <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Lifeline Identity v2.0</p>
        </div>
      </div>
    </>
  );
}

export default Header;
