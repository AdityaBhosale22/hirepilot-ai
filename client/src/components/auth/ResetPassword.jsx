import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, CheckCircle2 } from 'lucide-react';
import AuthCard from '../../components/auth/AuthCard';
import PasswordInput from '../../components/auth/PasswordInput';
import authApi from '../../api/auth.api';

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export default function ResetPassword() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      setSubmitError('');

      if (!token) {
        setSubmitError('Reset token is missing. Please request a new link.');
        return;
      }

      await authApi.resetPassword({
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      setIsSuccess(true);
      navigate('/login');
    } catch (error) {
      setSubmitError(error?.message || 'Could not reset password. Please try again.');
    }
  };

  if (isSuccess) {
    return (
      <AuthCard
        title="Password updated"
        subtitle="Your password has been successfully reset."
      >
        <div className="flex flex-col items-center justify-center text-center py-4">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <Link
            to="/login"
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-[#4F46E5] hover:bg-[#4338ca] transition-all"
          >
            Proceed to login
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Set new password"
      subtitle="Please enter your new password below."
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        {!token && (
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-200">
            The reset link is missing or invalid. Request a new password reset link first.
          </div>
        )}

        <PasswordInput
          label="New password"
          placeholder="Enter new password"
          error={errors.password}
          {...register('password')}
        />

        <PasswordInput
          label="Confirm new password"
          placeholder="Repeat new password"
          error={errors.confirmPassword}
          {...register('confirmPassword')}
        />

        {submitError && <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">{submitError}</div>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center items-center py-3 px-4 mt-2 border border-transparent rounded-lg text-sm font-medium text-white bg-[#4F46E5] hover:bg-[#4338ca] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reset Password'}
        </button>
      </form>
    </AuthCard>
  );
}