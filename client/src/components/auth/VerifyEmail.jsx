import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import AuthCard from '../../components/auth/AuthCard';

export default function VerifyEmail() {
  const [status, setStatus] = useState('verifying'); // verifying, success, error

  useEffect(() => {
    // Simulate verification API call on mount
    const verify = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setStatus('success'); // Change to 'error' to test failure state
      } catch (err) {
        setStatus('error');
      }
    };
    verify();
  }, []);

  return (
    <AuthCard
      title={
        status === 'verifying' ? 'Verifying email...' :
        status === 'success' ? 'Email verified' : 'Verification failed'
      }
      subtitle={
        status === 'verifying' ? 'Please wait while we verify your email address.' :
        status === 'success' ? 'Your account is now fully activated.' : 'The verification link is invalid or has expired.'
      }
    >
      <div className="flex flex-col items-center justify-center text-center py-8">
        {status === 'verifying' && (
          <Loader2 className="w-12 h-12 text-[#4F46E5] animate-spin mb-6" />
        )}
        
        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-8 border border-green-500/20">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <Link
              to="/login"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-[#4F46E5] hover:bg-[#4338ca] transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]"
            >
              Continue to login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-8 border border-red-500/20">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <button
              onClick={() => setStatus('verifying')} // Mock resend functionality
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-700 rounded-lg text-sm font-medium text-white bg-[#111] hover:bg-gray-800 transition-all mb-4"
            >
              Request new link
            </button>
            <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Return to login
            </Link>
          </>
        )}
      </div>
    </AuthCard>
  );
}