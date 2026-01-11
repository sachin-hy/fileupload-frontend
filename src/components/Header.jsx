import React from 'react';
import Logo from '../image/logo.png';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

import { toast } from 'react-toastify';


function Header() {

   const {isLoggedIn, login, logout} = useAuth();

 

  const handleLogout = () => {
      logout();
      toast.success("Logged out successfully");
  }

  return (
    <header className="w-full h-20 flex justify-between items-center bg-zinc-100 border-b">
      {/* Logo */}
      <div className="ml-8">
        <img 
          src="https://www.logo-designer.co/storage/2023/10/2023-sharefile-new-logo-design-520x321.png"
          alt="Company Logo" 
          className="h-full w-24  rounded-md"
        />
      </div>

      {/* Navigation */}
      <div className="flex gap-6">
        <Link to="/" className="text-gray-600 hover:text-black">
          Home
        </Link>
        <Link to="/features" className="text-gray-600 hover:text-black">
          Features
        </Link>
      </div>

      {/* Actions */}
      <div className="mr-8">
        {
          isLoggedIn ?
          (
              <button onClick={handleLogout} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  Logout    
              </button>
          ) 
          :
          (
            <>
              <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                 Sign In
              </Link>
              <Link to="/signup" className="ml-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                SignUp
              </Link>
            </>
          )
        }
        
      </div>
    </header>
  );
}

export default Header;