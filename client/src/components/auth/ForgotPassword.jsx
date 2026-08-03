import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, ArrowLeft, MailCheck } from 'lucide-react';
import AuthCard from '../../components/auth/AuthCard';
import authApi from '../../api/auth.api';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export default function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    const response = await authApi.forgotPassword({ email: data.email });

    if (response?.resetToken) {
      navigate(`/reset-password?token=${encodeURIComponent(response.resetToken)}&email=${encodeURIComponent(data.email)}`);
      return;
    }

    setMessage(response?.message || 'If the account exists, a reset link has been generated.');
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <AuthCard
        title="Check your email"
        subtitle="We've sent a password reset link to your inbox."
      >
        <div className="flex flex-col items-center justify-center text-center py-4">
          <div className="w-16 h-16 bg-[#4F46E5]/10 rounded-full flex items-center justify-center mb-6 border border-[#4F46E5]/20">
            <MailCheck className="w-8 h-8 text-[#4F46E5]" />
          </div>
          <p className="text-gray-300 text-sm mb-8">
            {message || "Click the link in the email to reset your password. If you don't see it, check your spam folder."}
          </p>
          <Link
            to="/login"
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-[#4F46E5] hover:bg-[#4338ca] transition-all"
          >
            Return to login
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Reset your password"
      subtitle="Enter your email address and we'll send you a link to reset your password."
    >
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-[#4F46E5] hover:bg-[#4338ca] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send reset link'}
        </button>

        <div className="text-center">
          <Link to="/login" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to login
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}