import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { GoogleLogin } from '@react-oauth/google';
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

import { login,googleLogin } from '../../store/slices/authSlice';
//import authService from '../../services/authService';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { isValidEmail } from '../../utils/helpers';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(
    localStorage.getItem('citilights_remember_me') === 'true'
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading } = useSelector((state) => state.auth);

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  // 📌 Handle normal login
  const onSubmit = async (data) => {
    try {
      if (rememberMe) {
        localStorage.setItem('citilights_remember_me', 'true');
      } else {
        localStorage.removeItem('citilights_remember_me');
      }

      const result = await dispatch(login({ ...data, rememberMe })).unwrap();

      if (result?.user?.userType === 'admin') {
        navigate('/admin', { replace: true });
      } else if (result?.user?.userType === 'customer') {
        navigate('/customer', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      if (error.includes('email')) {
        setError('email', { message: error });
      } else if (error.includes('password')) {
        setError('password', { message: error });
      }
    }
  };

  const handleGoogleSuccess = async (response) => {
  try {
    const idToken = response.credential; // Google One Tap gives this
    if (!idToken) {
      console.error("No ID token returned from Google");
      return;
    }

    // ✅ Call googleLogin thunk, not login
    dispatch(googleLogin(idToken));
  } catch (err) {
    console.error("Google login error:", err);
  }
};

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Or{' '}
          <Link
            to="/auth/register"
            className="font-medium text-primary-500 hover:text-primary-400"
          >
            create a new account
          </Link>
        </p>
      </div>

      {/* ---------- FORM ---------- */}
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email address"
          type="email"
          placeholder="Enter your email"
          leftIcon={<EnvelopeIcon className="h-5 w-5" />}
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            validate: (value) =>
              isValidEmail(value) || 'Please enter a valid email address',
          })}
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            leftIcon={<LockClosedIcon className="h-5 w-5" />}
            rightIcon={
              <button
                type="button"
                className="focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            }
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
          />
        </div>

        {/* Remember me + Forgot password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-900 dark:text-gray-100"
            >
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Link
              to="/auth/forgot-password"
              className="font-medium text-primary-500 hover:text-primary-400"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          loading={isLoading}
          disabled={isLoading}
        >
          Sign in
        </Button>
      </form>

      {/* ---------- SOCIAL LOGIN ---------- */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3">
           <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.error('Google Login Failed')}
            useOneTap // optional: enable One-Tap popup
          />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
