import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TelebirrPayment from '../../components/payment/TelebirrPayment';
// import MobileTransferPayment from '../../components/payment/MobileTransferPayment';
// import StripePayment from '../../components/payment/StripePayment';
// import PayPalPayment from '../../components/payment/PayPalPayment';
// import PaymentSuccess from '../../components/payment/PaymentSuccess';
// import PaymentFailed from '../../components/payment/PaymentFailed';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatCurrency } from '../../utils/helpers';

const PaymentProcessing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [paymentData, setPaymentData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('processing'); // processing, success, failed
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get payment data from location state or localStorage
    const data = location.state?.paymentData || 
                 JSON.parse(localStorage.getItem('pendingPayment') || '{}');
    
    if (!data || !data.registrationId) {
      // Redirect to home if no payment data
      navigate('/');
      return;
    }
    
    setPaymentData(data);
    setIsLoading(false);
    
    // Clear from localStorage
    localStorage.removeItem('pendingPayment');
  }, [location.state, navigate]);

  const handlePaymentSuccess = (paymentDetails) => {
    console.log('Payment successful:', paymentDetails);
    
    // Update registration status in localStorage
    const registrationKey = `registration_${paymentData.registrationId}`;
    const registrationData = JSON.parse(localStorage.getItem(registrationKey) || '{}');
    
    const updatedRegistration = {
      ...registrationData,
      status: 'paid',
      paymentDetails,
      paidAt: new Date().toISOString()
    };
    
    localStorage.setItem(registrationKey, JSON.stringify(updatedRegistration));
    localStorage.setItem('lastPayment', JSON.stringify({
      ...updatedRegistration,
      paymentDetails
    }));
    
    setPaymentStatus('success');
  };

  const handlePaymentFailure = (error) => {
    console.error('Payment failed:', error);
    setPaymentStatus('failed');
  };

  const renderPaymentComponent = () => {
    switch (paymentData.paymentMethod) {
      case 'telebirr':
        return (
          <TelebirrPayment
            amount={paymentData.registrationData.registrationFee}
            registrationId={paymentData.registrationId}
            onSuccess={handlePaymentSuccess}
            onFailure={handlePaymentFailure}
          />
        );
        
    //   case 'mobile_transfer':
    //     return (
    //       <MobileTransferPayment
    //         amount={paymentData.registrationData.registrationFee}
    //         registrationId={paymentData.registrationId}
    //         onSuccess={handlePaymentSuccess}
    //         onFailure={handlePaymentFailure}
    //       />
    //     );
        
    //   case 'stripe':
    //     return (
    //       <StripePayment
    //         amount={paymentData.registrationData.registrationFee}
    //         registrationId={paymentData.registrationId}
    //         customerData={paymentData.registrationData}
    //         onSuccess={handlePaymentSuccess}
    //         onFailure={handlePaymentFailure}
    //       />
    //     );
        
    //   case 'paypal':
    //     return (
    //       <PayPalPayment
    //         amount={paymentData.registrationData.registrationFee}
    //         registrationId={paymentData.registrationId}
    //         customerData={paymentData.registrationData}
    //         onSuccess={handlePaymentSuccess}
    //         onFailure={handlePaymentFailure}
    //       />
    //     );
        
      default:
        return (
          <div className="text-center py-8">
            <p className="text-red-600 dark:text-red-400">
              Invalid payment method selected
            </p>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading payment..." />
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Payment Session Expired
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your payment session has expired. Please start the registration process again.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {paymentStatus === 'success' ? 'Payment Successful!' :
                 paymentStatus === 'failed' ? 'Payment Failed' :
                 'Complete Your Payment'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Registration for "{paymentData.registrationData.propertyTitle}"
              </p>
            </div>
            
            {paymentStatus === 'processing' && (
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">Amount to Pay</p>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {formatCurrency(paymentData.registrationData.registrationFee, 'ETB')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {paymentStatus === 'processing' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {renderPaymentComponent()}
          </div>
        )}

        {/* {paymentStatus === 'success' && (
          <PaymentSuccess
            paymentData={paymentData}
            onContinue={() => navigate('/customer/dashboard')}
          />
        )} */}

        {/* {paymentStatus === 'failed' && (
          <PaymentFailed
            onRetry={() => setPaymentStatus('processing')}
            onCancel={() => navigate('/')}
          />
        )} */}
      </div>
    </div>
  );
};

export default PaymentProcessing;