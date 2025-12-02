'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/app/Lib/firebase/firebaseConf';
import { Mail, Lock, Loader, Eye, EyeOff } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    setError('');

    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!formData.password) {
      setError('Password is required');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Sign in with email and password
      await signInWithEmailAndPassword(auth, formData.email, formData.password);

      // Store remember me preference if checked
      if (rememberMe) {
        localStorage.setItem('rememberEmail', formData.email);
      } else {
        localStorage.removeItem('rememberEmail');
      }

      // Redirect to dashboard after successful signin
      router.push('/dashboard');
    } catch (err) {
      let errorMessage = 'An error occurred during sign in';
      
      if (err instanceof Error) {
        if (err.message.includes('user-not-found')) {
          errorMessage = 'No account found with this email address';
        } else if (err.message.includes('wrong-password')) {
          errorMessage = 'Incorrect password. Please try again.';
        } else if (err.message.includes('invalid-login-credentials')) {
          errorMessage = 'Invalid email or password';
        } else if (err.message.includes('too-many-requests')) {
          errorMessage = 'Too many login attempts. Please try again later.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your Mwalimu Tools account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white text-gray-900"
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white text-gray-900"
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
                <span className="text-sm text-gray-700">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <Link
            href="/signup"
            className="w-full block text-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Sign Up
          </Link>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-600 text-xs mt-6">
          Need help?{' '}
          <Link href="/contact" className="text-blue-600 hover:underline">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}
