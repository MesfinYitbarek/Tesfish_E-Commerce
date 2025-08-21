// import { useState } from 'react';
import { 
  CreditCardIcon,
  DevicePhoneMobileIcon,
  BanknotesIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/helpers';

const PaymentMethodSelection = ({ onMethodSelect, selectedMethod, amount }) => {
  const paymentMethods = [
    {
      id: 'telebirr',
      name: 'Telebirr',
      description: 'Pay using Telebirr mobile wallet',
      icon: DevicePhoneMobileIcon,
      type: 'local',
      fees: 0,
      processingTime: 'Instant',
      color: 'orange',
      supported: true
    },
    {
      id: 'mobile_transfer',
      name: 'Mobile Banking',
      description: 'Transfer from your bank mobile app',
      icon: BanknotesIcon,
      type: 'local',
      fees: 0,
      processingTime: 'Instant',
      color: 'green',
      supported: true
    },
    {
      id: 'stripe',
      name: 'Credit/Debit Card',
      description: 'Pay with Visa, Mastercard, or American Express',
      icon: CreditCardIcon,
      type: 'international',
      fees: Math.ceil(amount * 0.029), // 2.9% + 30 cents approximation
      processingTime: 'Instant',
      color: 'blue',
      supported: true
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay using your PayPal account',
      icon: GlobeAltIcon,
      type: 'international',
      fees: Math.ceil(amount * 0.034), // 3.4% + 30 cents approximation
      processingTime: 'Instant',
      color: 'purple',
      supported: true
    }
  ];

  const getColorClasses = (color, isSelected) => {
    const colors = {
      orange: {
        border: isSelected ? 'border-orange-500' : 'border-gray-200 dark:border-gray-700',
        bg: isSelected ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-white dark:bg-gray-800',
        icon: 'text-orange-500',
        text: 'text-orange-600 dark:text-orange-400'
      },
      green: {
        border: isSelected ? 'border-green-500' : 'border-gray-200 dark:border-gray-700',
        bg: isSelected ? 'bg-green-50 dark:bg-green-900/20' : 'bg-white dark:bg-gray-800',
        icon: 'text-green-500',
        text: 'text-green-600 dark:text-green-400'
      },
      blue: {
        border: isSelected ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700',
        bg: isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800',
        icon: 'text-blue-500',
        text: 'text-blue-600 dark:text-blue-400'
      },
      purple: {
        border: isSelected ? 'border-purple-500' : 'border-gray-200 dark:border-gray-700',
        bg: isSelected ? 'bg-purple-50 dark:bg-purple-900/20' : 'bg-white dark:bg-gray-800',
        icon: 'text-purple-500',
        text: 'text-purple-600 dark:text-purple-400'
      }
    };
    return colors[color];
  };

  return (
    <div className="space-y-4">
      {/* Local Payment Methods */}
      <div>
        <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-3">
          Local Payment Methods (Recommended)
        </h4>
        <div className="space-y-3">
          {paymentMethods.filter(method => method.type === 'local').map(method => {
            const isSelected = selectedMethod === method.id;
            const colors = getColorClasses(method.color, isSelected);
            
            return (
              <label
                key={method.id}
                className={`block p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${colors.border} ${colors.bg}`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={isSelected}
                  onChange={(e) => onMethodSelect(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                    <method.icon className={`h-6 w-6 ${colors.icon}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="font-semibold text-gray-900 dark:text-gray-100">
                        {method.name}
                      </h5>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(amount + method.fees, 'ETB')}
                        </p>
                        {method.fees > 0 && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            +{formatCurrency(method.fees, 'ETB')} fee
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {method.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Processing: {method.processingTime}
                      </span>
                      {method.fees === 0 && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs rounded-full">
                          No fees
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* International Payment Methods */}
      <div>
        <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-3">
          International Payment Methods
        </h4>
        <div className="space-y-3">
          {paymentMethods.filter(method => method.type === 'international').map(method => {
            const isSelected = selectedMethod === method.id;
            const colors = getColorClasses(method.color, isSelected);
            
            return (
              <label
                key={method.id}
                className={`block p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${colors.border} ${colors.bg}`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={isSelected}
                  onChange={(e) => onMethodSelect(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                    <method.icon className={`h-6 w-6 ${colors.icon}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="font-semibold text-gray-900 dark:text-gray-100">
                        {method.name}
                      </h5>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(amount + method.fees, 'ETB')}
                        </p>
                        {method.fees > 0 && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            +{formatCurrency(method.fees, 'ETB')} fee
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {method.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Processing: {method.processingTime}
                      </span>
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 text-xs rounded-full">
                        International
                      </span>
                    </div>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div className="text-sm">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Secure Payment</h4>
            <p className="text-gray-600 dark:text-gray-400">
              All payments are processed through secure, encrypted connections. Your payment information is never stored on our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelection;