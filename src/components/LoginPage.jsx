import axios from "axios";
import { useState } from 'react';
import { FaGoogle } from "react-icons/fa";
import { loginApi } from "../apiCall/LoginPageCall";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { BASEURL } from "../apiCall/BASEURL";

function LoginPage()
{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
   const {login} = useAuth();
    const navigate = useNavigate();


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Logging in:', email, password);

        loginApi(email,password,login,navigate);
    };

    const handleGoogleLogin = () => {
        
        console.log('Google login clicked');
        window.location.href = `${BASEURL}/oauth2/authorization/google`;
       
    };
   

    
return (
   <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
  <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
    <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
    
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Login
      </button>
    </form>

    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or</span>
        </div>
      </div>

      <button
        onClick={handleGoogleLogin}
        className="mt-4 w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        <FaGoogle className="text-red-500" />
        Sign in with Google
      </button>
    </div>

    <button
      onClick={() => navigate(-1)}
      className="mt-6 w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
    >
      Go Back
    </button>
  </div>
</div>
  );

   

}

export default LoginPage;