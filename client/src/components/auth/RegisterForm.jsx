import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  UserIcon,
  PhoneIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { register as registerUser,googleLogin } from '../../store/slices/authSlice';
import { GoogleLogin } from '@react-oauth/google';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { isValidEmail, isValidPhone } from '../../utils/helpers';
import { USER_TYPES } from '../../constants';

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState(USER_TYPES.CUSTOMER);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isLoading } = useSelector((state) => state.auth);

  const handleGoogleRegister = async (response) => {
    try {
      const idToken = response.credential;
      if (!idToken) {
        console.error("No ID token returned from Google");
        return;
      }

      // ✅ Dispatch googleRegister thunk
      await dispatch(googleLogin(idToken)).unwrap();

      // Navigate after successful Google registration
      navigate('/', { 
        state: { message: 'Registration successful via Google!' } 
      });
    } catch (error) {
      console.error("Google Register error:", error);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    if (!acceptTerms) {
      setError('terms', { message: 'You must accept the terms and conditions' });
      return;
    }

    try {
      // Prepare user data based on user type
      const userData = {
        email: data.email,
        password: data.password,
        userType,
      };

      // Add profile data based on user type
      if (userType === USER_TYPES.CUSTOMER) {
        userData.customerProfile = {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        };
      } else if (userType === USER_TYPES.INDIVIDUAL) {
        userData.individualProfile = {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        };
      } else if (userType === USER_TYPES.COMPANY) {
        userData.companyProfile = {
          companyName: data.companyName,
          contactInfo: {
            phone: data.phone,
            email: data.email,
          },
          businessCategories: data.businessCategories || [],
        };
      }

      await dispatch(registerUser(userData)).unwrap();
      navigate('/auth/login', { 
        state: { 
          message: 'Registration successful! Please check your email for verification.' 
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const userTypeOptions = [
    {
      value: USER_TYPES.CUSTOMER,
      label: 'Customer',
      description: 'Looking to buy or rent properties',
      icon: UserIcon,
    },
    {
      value: USER_TYPES.INDIVIDUAL,
      label: 'Individual Seller',
      description: 'Sell your own properties',
      icon: UserIcon,
    },
    {
      value: USER_TYPES.COMPANY,
      label: 'Company',
      description: 'Real estate company or service provider',
      icon: BuildingOfficeIcon,
    },
  ];

  const businessCategories = [
    'real-estate',
    'construction',
    'interior-design',
    'engineering',
    'general-retail',
    'services',
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            to="/auth/login"
            className="font-medium text-primary-500 hover:text-primary-400"
          >
            Sign in here
          </Link>
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* User Type Selection */}
        <div>
          <label className="text-base font-medium text-gray-900 dark:text-gray-100">
            I am a...
          </label>
          <fieldset className="mt-4">
            <div className="space-y-4">
              {userTypeOptions.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    id={option.value}
                    name="userType"
                    type="radio"
                    checked={userType === option.value}
                    onChange={() => setUserType(option.value)}
                    className="h-4 w-4 border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <label
                    htmlFor={option.value}
                    className="ml-3 block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                  >
                    <div className="flex items-center">
                      <option.icon className="h-5 w-5 mr-2 text-gray-400" />
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-gray-500 text-xs">{option.description}</div>
                      </div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
        </div>

        {/* Email */}
        <Input
          label="Email address"
          type="email"
          placeholder="Enter your email"
          leftIcon={<EnvelopeIcon className="h-5 w-5" />}
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            validate: (value) => isValidEmail(value) || 'Please enter a valid email address',
          })}
        />

        {/* Name Fields */}
        {userType === USER_TYPES.COMPANY ? (
          <Input
            label="Company Name"
            placeholder="Enter your company name"
            leftIcon={<BuildingOfficeIcon className="h-5 w-5" />}
            error={errors.companyName?.message}
            {...register('companyName', {
              required: 'Company name is required',
              minLength: {
                value: 2,
                message: 'Company name must be at least 2 characters',
              },
            })}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              label="First Name"
              placeholder="Enter your first name"
              leftIcon={<UserIcon className="h-5 w-5" />}
              error={errors.firstName?.message}
              {...register('firstName', {
                required: 'First name is required',
                minLength: {
                  value: 2,
                  message: 'First name must be at least 2 characters',
                },
              })}
            />
            <Input
              label="Last Name"
              placeholder="Enter your last name"
              leftIcon={<UserIcon className="h-5 w-5" />}
              error={errors.lastName?.message}
              {...register('lastName', {
                required: 'Last name is required',
                minLength: {
                  value: 2,
                  message: 'Last name must be at least 2 characters',
                },
              })}
            />
          </div>
        )}

        {/* Phone */}
        <Input
          label="Phone Number"
          type="tel"
          placeholder="Enter your phone number"
          leftIcon={<PhoneIcon className="h-5 w-5" />}
          error={errors.phone?.message}
          {...register('phone', {
            required: 'Phone number is required',
            validate: (value) => isValidPhone(value) || 'Please enter a valid Ethiopian phone number',
          })}
        />

        {/* Business Categories for Companies */}
        {userType === USER_TYPES.COMPANY && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Business Categories
            </label>
            <div className="grid grid-cols-2 gap-2">
              {businessCategories.map((category) => (
                <div key={category} className="flex items-center">
                  <input
                    id={category}
                    type="checkbox"
                    value={category}
                    className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                    {...register('businessCategories')}
                  />
                  <label
                    htmlFor={category}
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize"
                  >
                    {category.replace('-', ' ')}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Password */}
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Create a password"
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
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
              message: 'Password must contain uppercase, lowercase, and number',
            },
          })}
        />

        {/* Confirm Password */}
        <Input
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Confirm your password"
          leftIcon={<LockClosedIcon className="h-5 w-5" />}
          rightIcon={
            <button
              type="button"
              className="focus:outline-none"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          }
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === password || 'Passwords do not match',
          })}
        />

        {/* Terms and Conditions */}
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className="text-gray-600 dark:text-gray-400">
              I agree to the{' '}
              <Link
                to="/terms"
                target="_blank"
                className="text-primary-500 hover:text-primary-400"
              >
                Terms and Conditions
              </Link>{' '}
              and{' '}
              <Link
                to="/privacy"
                target="_blank"
                className="text-primary-500 hover:text-primary-400"
              >
                Privacy Policy
              </Link>
            </label>
            {errors.terms && (
              <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          loading={isLoading}
          disabled={isLoading || !acceptTerms}
        >
          Create Account
        </Button>
      </form>

      {/* Social Registration */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">
              Or register with
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <GoogleLogin
            onSuccess={handleGoogleRegister}
            onError={() => console.error('Google Register Failed')}
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;