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

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export default function Register() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Registration data:', data);
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsGoogleLoading(false);
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-[#4F46E5] hover:text-[#06B6D4] transition-colors">
            Sign in instead
          </Link>
        </>
      }
    >
      <SocialLogin isLoading={isGoogleLoading} onClick={handleGoogleLogin} />
      <Divider />

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Full name
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className={`appearance-none block w-full px-4 py-3 bg-[#111] border ${
              errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-800 focus:border-[#4F46E5] focus:ring-[#4F46E5]'
            } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors`}
            placeholder="John Doe"
          />
          {errors.name && <p className="mt-1.5 text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Work email
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
          placeholder="Create a strong password"
          error={errors.password}
          {...register('password')}
        />

        <PasswordInput
          label="Confirm password"
          placeholder="Repeat your password"
          error={errors.confirmPassword}
          {...register('confirmPassword')}
        />

        <div className="text-sm text-gray-400">
          By signing up, you agree to our{' '}
          <a href="#" className="font-medium text-[#4F46E5] hover:text-[#06B6D4]">Terms of Service</a>{' '}
          and{' '}
          <a href="#" className="font-medium text-[#4F46E5] hover:text-[#06B6D4]">Privacy Policy</a>.
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.3)] text-sm font-medium text-white bg-[#4F46E5] hover:bg-[#4338ca] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#030712] focus:ring-[#4F46E5] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
        </button>
      </form>
    </AuthCard>
  );
}