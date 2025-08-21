import { useState } from 'react';
import { 
  DevicePhoneMobileIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { formatCurrency } from '../../utils/helpers';
import { toast } from 'react-hot-toast';

const TelebirrPayment = ({ amount, registrationId, onSuccess, onFailure }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState('input'); // input, waiting, success, failed
  const [transactionId, setTransactionId] = useState('');
  const [errors, setErrors] = useState({});

  const validatePhoneNumber = (phone) => {
    // Ethiopian Telebirr phone number validation
    const telebirrRegex = /^(\+251|0)?[9]\d{8}$/;
    return telebirrRegex.test(phone.replace(/\s/g, ''));
  };

  const handlePayment = async () => {
    // Validate phone number
    if (!phoneNumber.trim()) {
      setErrors({ phone: 'Phone number is required' });
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setErrors({ phone: 'Please enter a valid Telebirr phone number' });
      return;
    }

    setErrors({});
    setIsProcessing(true);
    setPaymentStep('waiting');

    try {
      // Generate transaction ID
      const txnId = `TLB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setTransactionId(txnId);

      // Simulate Telebirr API call
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simulate payment processing (90% success rate)
      const isSuccessful = Math.random() > 0.1;

      if (isSuccessful) {
        const paymentDetails = {
          transactionId: txnId,
          method: 'telebirr',
          amount,
          phoneNumber: phoneNumber,
          status: 'completed',
          timestamp: new Date().toISOString()
        };

        setPaymentStep('success');
        toast.success('Payment successful!');
        onSuccess(paymentDetails);
      } else {
        throw new Error('Payment was declined');
      }
    } catch (error) {
      console.error('Telebirr payment error:', error);
      setPaymentStep('failed');
      toast.error('Payment failed. Please try again.');
      onFailure(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const retry = () => {
    setPaymentStep('input');
    setTransactionId('');
    setErrors({});
  };

  if (paymentStep === 'waiting') {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <ClockIcon className="h-8 w-8 text-orange-500 animate-spin" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Processing Payment...
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Please check your phone for Telebirr payment confirmation
        </p>
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
          <p className="text-sm text-orange-800 dark:text-orange-200">
            Transaction ID: <span className="font-mono">{transactionId}</span>
          </p>
          <p className="text-sm text-orange-800 dark:text-orange-200 mt-1">
            Amount: {formatCurrency(amount, 'ETB')}
          </p>
        </div>
      </div>
    );
  }

  if (paymentStep === 'success') {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircleIcon className="h-8 w-8 text-green-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Payment Successful!
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Your registration payment has been processed successfully
        </p>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-sm text-green-800 dark:text-green-200">
            Transaction ID: <span className="font-mono">{transactionId}</span>
          </p>
        </div>
      </div>
    );
  }

  if (paymentStep === 'failed') {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Payment Failed
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Your payment could not be processed. Please check your balance and try again.
        </p>
        <div className="flex justify-center space-x-4">
          <Button variant="outline" onClick={retry}>
            Try Again
          </Button>
          <Button onClick={() => window.location.href = 'tel:8687'}>
            Call Telebirr Support
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <DevicePhoneMobileIcon className="h-8 w-8 text-orange-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Pay with Telebirr
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Enter your Telebirr phone number to complete the payment
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {/* Payment Amount */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Amount to Pay</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {formatCurrency(amount, 'ETB')}
          </p>
        </div>

        {/* Phone Number Input */}
        <div>
          <Input
            label="Telebirr Phone Number"
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
              if (errors.phone) {
                setErrors({ ...errors, phone: '' });
              }
            }}
            error={errors.phone}
            placeholder="09XX XXX XXX"
            leftIcon={<DevicePhoneMobileIcon className="h-4 w-4" />}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Enter the phone number registered with your Telebirr account
          </p>
        </div>

        {/* Payment Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            Payment Instructions:
          </h4>
          <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
            <li>Click "Pay Now" button below</li>
            <li>You'll receive a payment request on your phone</li>
            <li>Enter your Telebirr PIN to confirm</li>
            <li>Wait for payment confirmation</li>
          </ol>
        </div>

        {/* Security Notice */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Secure payment powered by Telebirr</span>
          </div>
        </div>

        {/* Pay Button */}
        <Button
          onClick={handlePayment}
          disabled={isProcessing || !phoneNumber}
          className="w-full bg-orange-500 hover:bg-orange-600"
          size="lg"
        >
          {isProcessing ? 'Processing...' : `Pay ${formatCurrency(amount, 'ETB')}`}
        </Button>

        {/* Help Links */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Need help? Call Telebirr customer service at{' '}
            <a href="tel:8687" className="text-orange-500 hover:underline">8687</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TelebirrPayment;