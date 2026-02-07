

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

function Header() {
  const { isLoggedIn, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  const activeClass = (path) => 
    location.pathname === path 
      ? "text-indigo-600 border-b-2 border-indigo-600" 
      : "text-slate-500 hover:text-slate-900 border-b-2 border-transparent";

  return (
    <header className="w-full h-20 bg-white border-b border-slate-200 px-8 flex justify-between items-center sticky top-0 z-50">
      
   
      <div className="flex items-center h-full">
        <Link to="/" className="flex items-center overflow-hidden h-full">
          
          <img 
            src="https://www.logo-designer.co/storage/2023/10/2023-sharefile-new-logo-design-520x321.png"
            alt="Company Logo" 
            className="h-12 w-auto object-contain transform scale-150 origin-left"
          />
        </Link>

   
        <div className="h-8 w-px bg-slate-200 mx-10"></div>

        <nav className="flex h-full gap-8">
          <Link to="/" className={`flex items-center text-sm font-semibold tracking-wide transition-all px-1 ${activeClass('/')}`}>
            HOME
          </Link>
          <Link to="/features" className={`flex items-center text-sm font-semibold tracking-wide transition-all px-1 ${activeClass('/features')}`}>
            FEATURES
          </Link>
        </nav>
      </div>

     
      <div className="flex items-center gap-6">
        {isLoggedIn ? (
          <button 
            onClick={handleLogout} 
            className="text-sm font-bold text-slate-600 hover:text-red-600 transition-colors"
          >
            Logout
          </button>
        ) : (
          <>
            <Link 
              to="/login" 
              className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              SIGN IN
            </Link>
            <Link 
              to="/signup" 
              className="bg-indigo-600 text-white px-7 py-3 rounded-lg font-bold text-sm hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all active:scale-95"
            >
              GET STARTED
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;