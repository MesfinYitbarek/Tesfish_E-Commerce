import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  EnvelopeIcon, 
  CheckCircleIcon,
  GiftIcon,
  BellIcon,
  ArrowTrendingUpIcon, // Fixed: was TrendingUpIcon
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { isValidEmail } from '../../utils/helpers';
import { toast } from 'react-hot-toast';

const NewsletterSection = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Simulate API call to subscribe user
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real implementation, make API call to subscribe user
      console.log('Newsletter subscription:', data);
      
      setIsSubscribed(true);
      reset();
      toast.success('Successfully subscribed to newsletter!');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    {
      icon: BellIcon,
      title: 'New Property Alerts',
      description: 'Get notified when properties matching your criteria are listed'
    },
    {
      icon: ArrowTrendingUpIcon, // Fixed: was TrendingUpIcon
      title: 'Market Insights',
      description: 'Weekly market trends and property value analysis'
    },
    {
      icon: GiftIcon,
      title: 'Exclusive Offers',
      description: 'Special deals and early access to premium listings'
    },
    {
      icon: DocumentTextIcon,
      title: 'Expert Tips',
      description: 'Professional advice on buying, selling, and investing'
    }
  ];

  // Rest of your component remains the same...
  if (isSubscribed) {
    return (
      <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="h-10 w-10 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Welcome to Our Community!
            </h2>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Thank you for subscribing! You'll receive your first newsletter within the next 24 hours. 
              Check your email for a welcome message with exclusive content.
            </p>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                What to Expect
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">Weekly market updates</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">New property notifications</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">Investment tips</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">Exclusive offers</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsSubscribed(false)}
              className="mt-6 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Subscribe with a different email
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-primary-50 to-blue-100 dark:from-primary-900/20 dark:to-blue-900/20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-pattern-cross-light"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-full mb-6">
              <EnvelopeIcon className="h-8 w-8 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Stay Updated with CitiLights
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Join over 10,000 subscribers and get the latest property listings, 
              market insights, and exclusive offers delivered to your inbox.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
              >
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          {/* Newsletter Signup Form */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 lg:p-12">
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    placeholder="Enter your first name"
                    error={errors.firstName?.message}
                    {...register('firstName', {
                      required: 'First name is required',
                      minLength: {
                        value: 2,
                        message: 'First name must be at least 2 characters'
                      }
                    })}
                  />
                  
                  <Input
                    label="Last Name"
                    placeholder="Enter your last name"
                    error={errors.lastName?.message}
                    {...register('lastName', {
                      required: 'Last name is required',
                      minLength: {
                        value: 2,
                        message: 'Last name must be at least 2 characters'
                      }
                    })}
                  />
                </div>

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email address"
                  leftIcon={<EnvelopeIcon className="h-5 w-5" />}
                  error={errors.email?.message}
                  {...register('email', {
                    required: 'Email is required',
                    validate: (value) => isValidEmail(value) || 'Please enter a valid email address'
                  })}
                />

                {/* Preferences */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    What are you interested in? (Optional)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      'Residential Properties',
                      'Commercial Properties',
                      'Rental Properties',
                      'Professional Services',
                      'Market Analysis',
                      'Investment Opportunities'
                    ].map((interest) => (
                      <label key={interest} className="flex items-center">
                        <input
                          type="checkbox"
                          value={interest}
                          className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                          {...register('interests')}
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          {interest}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Privacy Notice */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-start">
                    <input
                      id="privacy-consent"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500 mt-0.5"
                      {...register('privacyConsent', {
                        required: 'You must agree to our privacy policy'
                      })}
                    />
                    <label htmlFor="privacy-consent" className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                      I agree to receive marketing communications from CitiLights and understand that 
                      I can unsubscribe at any time. Read our{' '}
                      <a href="/privacy" className="text-primary-500 hover:text-primary-400">
                        Privacy Policy
                      </a>
                      .
                    </label>
                  </div>
                  {errors.privacyConsent && (
                    <p className="mt-2 text-sm text-red-600">{errors.privacyConsent.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading ? 'Subscribing...' : 'Subscribe to Newsletter'}
                  <EnvelopeIcon className="h-5 w-5 ml-2" />
                </Button>
              </form>

              {/* Social Proof */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Join over <strong>10,000 satisfied subscribers</strong>
                </p>
                
                <div className="flex justify-center items-center space-x-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center text-white text-xs font-medium"
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-yellow-500">★★★★★</span>
                    <span className="ml-1">4.9/5 average rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No spam, unsubscribe at any time. We respect your privacy and will never share your information.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;