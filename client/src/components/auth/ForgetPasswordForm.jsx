import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { isValidEmail } from '../../utils/helpers';
import authService from '../../services/authService';
import { toast } from 'react-hot-toast';

const ForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setEmailSent(true);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <EnvelopeIcon className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Check your email
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            We've sent a password reset link to your email address.
          </p>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Didn't receive the email? Check your spam folder or{' '}
            <button
              onClick={() => setEmailSent(false)}
              className="text-primary-500 hover:text-primary-400"
            >
              try again
            </button>
          </p>
          <Link
            to="/auth/login"
            className="inline-flex items-center text-sm text-primary-500 hover:text-primary-400"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/auth/login"
          className="inline-flex items-center text-sm text-primary-500 hover:text-primary-400"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to sign in
        </Link>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Forgot your password?
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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

        <Button
          type="submit"
          className="w-full"
          loading={isLoading}
          disabled={isLoading}
        >
          Send reset link
        </Button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;