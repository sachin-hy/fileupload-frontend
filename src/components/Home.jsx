import React from 'react';
import HomeImage from '../image/homepage.png';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="w-full h-screen flex">
      {/* Left Content Section */}
      <div className="w-1/2 h-full flex justify-center items-center px-16">
        <div className="w-full max-w-md">  {/* Content stays left-aligned but container centered */}
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            File Transfer
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
           Send large files instantly. Secure, fast, and free file sharing for everyone.
          </p>
          
          <Link to="/upload" className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-600 transition duration-200 shadow-md">
           Get Started
          </Link>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="w-1/2 h-full bg-zinc-500">
        <img 
          className="h-full w-full object-cover" 
          src={HomeImage} 
          alt="homeimage"
        />
      </div>
    </div>
  );
}

export default Home;