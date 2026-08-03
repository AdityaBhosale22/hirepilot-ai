import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import AuthCard from '../../components/auth/AuthCard';
import authApi from '../../api/auth.api';

const verificationSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);
  const emailFromQuery = useMemo(() => searchParams.get('email') || '', [searchParams]);
  const [status, setStatus] = useState(token ? 'verifying' : 'idle'); // idle, verifying, success, error
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      email: emailFromQuery,
    },
  });

  useEffect(() => {
    if (!emailFromQuery) return;
    setValue('email', emailFromQuery);
  }, [emailFromQuery, setValue]);

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        const response = await authApi.verifyEmail({ token });
        setSuccessMessage(response?.message || 'Your email has been verified.');
        setStatus('success');
      } catch (error) {
        setSubmitError(error?.message || 'The verification link is invalid or has expired.');
        setStatus('error');
      }
    };

    verify();
  }, [token]);

  const onSubmit = async (data) => {
    try {
      setSubmitError('');
      const response = await authApi.resendVerification({ email: data.email });

      if (response?.verificationToken) {
        navigate(
          `/verify-email?token=${encodeURIComponent(response.verificationToken)}&email=${encodeURIComponent(data.email)}`
        );
        return;
      }

      setSuccessMessage(response?.message || 'Verification link generated.');
      setStatus('success');
    } catch (error) {
      setSubmitError(error?.message || 'Could not request a new verification link.');
    }
  };

  if (status === 'verifying') {
    return (
      <AuthCard
        title="Verifying email..."
        subtitle="Please wait while we verify your email address."
      >
        <div className="flex flex-col items-center justify-center text-center py-8">
          <Loader2 className="w-12 h-12 text-[#4F46E5] animate-spin mb-6" />
        </div>
      </AuthCard>
    );
  }

  if (status === 'success') {
    return (
      <AuthCard
        title="Email verified"
        subtitle={successMessage || 'Your account is now fully activated.'}
      >
        <div className="flex flex-col items-center justify-center text-center py-8">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-8 border border-green-500/20">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <Link
            to="/login"
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-[#4F46E5] hover:bg-[#4338ca] transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]"
          >
            Continue to login
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title={status === 'error' ? 'Verification failed' : 'Request a verification link'}
      subtitle={
        status === 'error'
          ? submitError || 'The verification link is invalid or has expired.'
          : 'Enter your email address and we will generate a new verification link.'
      }
    >
      <div className="flex flex-col items-center justify-center text-center py-4">
        {status === 'error' && (
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        )}

        <form className="w-full space-y-5 text-left" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email address
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={`appearance-none block w-full px-4 py-3 bg-[#111] border ${
                errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-800 focus:border-[#4F46E5] focus:ring-[#4F46E5]'
              } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors`}
              placeholder="you@company.com"
            />
            {errors.email && <p className="mt-1.5 text-sm text-red-500">{errors.email.message}</p>}
          </div>

          {submitError && <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">{submitError}</div>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-[#4F46E5] hover:bg-[#4338ca] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Request new link'}
          </button>

          <div className="text-center">
            <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Return to login
            </Link>
          </div>
        </form>
      </div>
    </AuthCard>
  );
}