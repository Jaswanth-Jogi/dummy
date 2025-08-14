'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const EmailVerification = () => {
  const { user, sendEmailVerification, checkEmailVerification } = useAuth();
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      checkVerificationStatus();
    }
  }, [user]);

  const checkVerificationStatus = async () => {
    if (!user) return;
    
    try {
      const verified = await checkEmailVerification();
      setIsVerified(verified);
    } catch (error) {
      console.error('Error checking verification status:', error);
    }
  };

  const handleResendVerification = async () => {
    if (!user) return;
    
    setLoading(true);
    setMessage('');
    
    try {
      await sendEmailVerification();
      setMessage('Verification email sent! Please check your inbox.');
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user || isVerified) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-yellow-800">
            Email Verification Required
          </h3>
          <p className="text-sm text-yellow-700 mt-1">
            Please verify your email address to access all features.
          </p>
          {message && (
            <p className={`text-sm mt-2 ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </p>
          )}
        </div>
        <Button
          onClick={handleResendVerification}
          disabled={loading}
          variant="outline"
          size="sm"
          className="text-yellow-800 border-yellow-300 hover:bg-yellow-100"
        >
          {loading ? 'Sending...' : 'Resend Email'}
        </Button>
      </div>
    </div>
  );
};

export default EmailVerification;
