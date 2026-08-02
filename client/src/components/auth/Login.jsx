import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import AuthCard from '../../components/auth/AuthCard';
import PasswordInput from '../../components/auth/PasswordInput';
import SocialLogin from '../../components/auth/SocialLogin';
import Divider from '../../components/auth/Divider';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function Login() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Login data:', data);
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsGoogleLoading(false);
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle={
        <>
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-[#4F46E5] hover:text-[#06B6D4] transition-colors">
            Start your free trial
          </Link>
        </>
      }
    >
      <SocialLogin isLoading={isGoogleLoading} onClick={handleGoogleLogin} />
      <Divider />

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
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

        <PasswordInput
          label="Password"
          placeholder="••••••••"
          error={errors.password}
          {...register('password')}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-700 bg-[#111] text-[#4F46E5] focus:ring-[#4F46E5] focus:ring-offset-[#030712]"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Link to="/forgot-password" className="font-medium text-[#4F46E5] hover:text-[#06B6D4] transition-colors">
              Forgot your password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#4F46E5] hover:bg-[#4338ca] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#030712] focus:ring-[#4F46E5] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign in'}
        </button>
      </form>
    </AuthCard>
  );
}