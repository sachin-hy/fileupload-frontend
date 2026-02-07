
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import heroImage from '../image/homeinage.png';

function Home() {
 
 
  return (
    <div className="w-full h-[calc(100vh-80px)] flex bg-[#f8fafc] overflow-hidden">
      
      
      <div className="w-full md:w-5/12 h-full flex items-center px-12 lg:px-20 relative">
       
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>
        
        <div className="w-full max-w-lg z-10">
         
          
          <h1 className="text-6xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight">
            Move your <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
              Big Data
            </span> Fast.
          </h1>
          
          <p className="text-lg text-slate-500 mb-10 leading-relaxed font-medium">
            Send large files instantly. Secure, fast, and free file sharing for everyone.
          </p>
          
          <div className="flex items-center gap-4">
            <Link 
              to="/upload" 
              className="group bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

       
        </div>
      </div>

   
      <div className="hidden md:block w-7/12 h-full p-8">
        <div className="h-full w-full relative rounded-3xl overflow-hidden shadow-2xl border border-white">
       
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 to-transparent z-10"></div>
          
          <img 
            className="h-full w-full object-cover scale-105" 
            src={heroImage} 
            alt="Data visualization"
          />

        
        </div>
      </div>
    </div>
  );
}

export default Home;