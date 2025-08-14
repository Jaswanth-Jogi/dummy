'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Login1 from '@/components/ui/login1';
import Signup from '@/components/ui/signup';
import EmailVerification from '@/components/ui/EmailVerification';

export default function Home() {
  const { user, logout, backendStatus } = useAuth();
  const [showSignup, setShowSignup] = useState(false);

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Hello World! 👋
          </h1>
          <p className="text-gray-600 mb-6">
            Welcome back, <span className="font-semibold">{user.email}</span>
          </p>
          
          <EmailVerification />
          
          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Backend Status: <span className="font-mono">{backendStatus}</span>
            </p>
          </div>
          
          <button
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {showSignup ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-600">
            {showSignup ? 'Sign up to get started' : 'Sign in to your account'}
          </p>
        </div>

        {showSignup ? <Signup /> : <Login1 />}

        <div className="text-center mt-6">
          <button
            onClick={() => setShowSignup(!showSignup)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {showSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
