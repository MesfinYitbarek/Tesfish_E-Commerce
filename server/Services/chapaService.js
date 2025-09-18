// backend/services/chapaService.js
import fetch from 'node-fetch';

/**
 * Helper function to validate Ethiopian phone numbers
 */
const validateEthiopianPhone = (phone) => {
  if (!phone) return false;
  
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Ethiopian phone patterns:
  // +251XXXXXXXXX (13 digits)
  // 251XXXXXXXXX (12 digits)
  // 0XXXXXXXXX (10 digits starting with 0)
  // XXXXXXXXX (9 digits)
  
  const patterns = [
    /^251[79]\d{8}$/, // 251XXXXXXXXX
    /^0[79]\d{8}$/, // 0XXXXXXXXX
    /^[79]\d{8}$/ // XXXXXXXXX
  ];
  
  return patterns.some(pattern => pattern.test(cleanPhone));
};

/**
 * Format Ethiopian phone number for Chapa
 */
const formatEthiopianPhone = (phone) => {
  if (!phone) return null;
  
  // Remove all non-digit characters
  let cleanPhone = phone.replace(/\D/g, '');
  
  // Convert to international format
  if (cleanPhone.startsWith('251')) {
    cleanPhone = '+' + cleanPhone;
  } else if (cleanPhone.startsWith('0')) {
    cleanPhone = '+251' + cleanPhone.substring(1);
  } else if (cleanPhone.length === 9) {
    cleanPhone = '+251' + cleanPhone;
  }
  
  return cleanPhone;
};

/**
 * Generate transaction reference
 */
export const generateTxRef = (options = {}) => {
  const {
    prefix = 'REG',
    size = 15
  } = options;
  
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, size - prefix.length - timestamp.length + 2);
  
  return `${prefix}-${timestamp}-${random}`.substring(0, size + prefix.length + 1);
};
const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
};
/**
 * Initiate payment using direct HTTP call to Chapa API
 */
export const initiateChapa = async ({ 
  tx_ref, 
  amount, 
  currency = 'ETB', 
  email, 
  firstName, 
  lastName, 
  phone, 
  callbackUrl, 
  returnUrl, 
  customization = {} 
}) => {
  try {
    console.log('=== Initiating Chapa Payment (Direct API) ===');
    
    // Validate environment
    if (!process.env.CHAPA_SECRET_KEY) {
      throw new Error('CHAPA_SECRET_KEY environment variable is not set');
    }

    // Validate inputs
    if (!firstName?.trim()) throw new Error('First name is required');
    if (!lastName?.trim()) throw new Error('Last name is required');
    if (!email?.trim()) throw new Error('Email is required');
    if (!phone?.trim()) throw new Error('Phone number is required');
    if (!tx_ref?.trim()) throw new Error('Transaction reference is required');
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      throw new Error('Valid amount is required');
    }
    if (!callbackUrl || !returnUrl) throw new Error('Callback and return URLs are required');

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Validate and format phone number
    if (!validateEthiopianPhone(phone)) {
      throw new Error('Invalid Ethiopian phone number format. Use formats like: +251911123456, 0911123456, or 911123456');
    }

    const formattedPhone = formatEthiopianPhone(phone);
    console.log('Formatted phone:', phone, '->', formattedPhone);

    // Prepare customization with proper length limits
    const chapaCustomization = {
      title: truncateText(customization.title || 'Payment', 16), // Max 16 chars
      description: truncateText(customization.description || 'Payment for services', 50) // Max 50 chars
    };

    console.log('Original customization:', customization);
    console.log('Truncated customization:', chapaCustomization);

    // Prepare payload
    const payload = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone_number: formattedPhone,
      currency: currency,
      amount: String(Number(amount).toFixed(2)),
      tx_ref: tx_ref.trim(),
      callback_url: callbackUrl,
      return_url: returnUrl,
      customization: chapaCustomization
    };

    console.log('Chapa API payload:', {
      ...payload,
      phone_number: payload.phone_number?.substring(0, 7) + '****' // Mask for security
    });

    // Make direct API call
    const response = await fetch('https://api.chapa.co/v1/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'TesGold-App/1.0'
      },
      body: JSON.stringify(payload)
    });

    console.log('Chapa API response status:', response.status);

    let responseData;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      const textResponse = await response.text();
      console.log('Non-JSON response from Chapa:', textResponse);
      throw new Error(`Unexpected response format from Chapa: ${textResponse}`);
    }

    console.log('Chapa API response data:', responseData);

    if (!response.ok) {
      console.error('Chapa API error response:', responseData);
      
      let errorMessage = 'Payment initialization failed';
      
      if (responseData?.message) {
        if (typeof responseData.message === 'object') {
          // Handle validation errors like the one you encountered
          const errors = [];
          for (const [field, messages] of Object.entries(responseData.message)) {
            if (Array.isArray(messages)) {
              errors.push(`${field}: ${messages.join(', ')}`);
            } else {
              errors.push(`${field}: ${messages}`);
            }
          }
          errorMessage = errors.join('; ');
        } else {
          errorMessage = responseData.message;
        }
      } else if (responseData?.error) {
        errorMessage = responseData.error;
      } else if (responseData?.errors) {
        errorMessage = Array.isArray(responseData.errors) 
          ? responseData.errors.join(', ')
          : JSON.stringify(responseData.errors);
      }

      return {
        success: false,
        message: errorMessage,
        details: responseData,
        status: response.status
      };
    }

    if (responseData.status !== 'success') {
      console.error('Chapa returned failure status:', responseData);
      return {
        success: false,
        message: responseData.message || 'Payment initialization failed',
        details: responseData
      };
    }

    if (!responseData.data?.checkout_url) {
      console.error('No checkout URL in Chapa response:', responseData);
      return {
        success: false,
        message: 'No payment URL received from Chapa',
        details: responseData
      };
    }

    console.log('Chapa payment initialized successfully');
    return {
      success: true,
      data: responseData.data
    };

  } catch (error) {
    console.error('=== Chapa Initialization Error (Direct API) ===');
    console.error('Error type:', typeof error);
    console.error('Error name:', error?.name);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);

    // Handle specific error types
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        success: false,
        message: 'Network error: Unable to connect to Chapa API. Please check your internet connection.',
        details: { networkError: true }
      };
    }

    if (error.name === 'AbortError') {
      return {
        success: false,
        message: 'Request timeout: Chapa API is taking too long to respond. Please try again.',
        details: { timeout: true }
      };
    }

    return {
      success: false,
      message: error?.message || 'Payment initialization error',
      details: { 
        errorType: error?.name,
        originalMessage: error?.message
      }
    };
  }
};

/**
 * Verify payment using direct HTTP call to Chapa API
 */
export const verifyChapa = async (tx_ref) => {
  try {
    console.log('=== Verifying Chapa Payment (Direct API) ===');
    console.log('Transaction reference:', tx_ref);

    if (!tx_ref?.trim()) {
      throw new Error('Transaction reference is required');
    }

    if (!process.env.CHAPA_SECRET_KEY) {
      throw new Error('CHAPA_SECRET_KEY environment variable is not set');
    }

    const response = await fetch(`https://api.chapa.co/v1/transaction/verify/${encodeURIComponent(tx_ref.trim())}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'TesGold-App/1.0'
      }
    });

    console.log('Chapa verify response status:', response.status);

    let responseData;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      const textResponse = await response.text();
      console.log('Non-JSON verify response from Chapa:', textResponse);
      throw new Error(`Unexpected response format from Chapa: ${textResponse}`);
    }

    console.log('Chapa verify response data:', responseData);

    if (!response.ok) {
      console.error('Chapa verify API error:', responseData);
      
      let errorMessage = 'Payment verification failed';
      if (responseData?.message) {
        errorMessage = responseData.message;
      }

      return {
        success: false,
        message: errorMessage,
        details: responseData,
        status: response.status
      };
    }

    if (responseData.status !== 'success') {
      return {
        success: false,
        message: responseData.message || 'Payment verification failed',
        details: responseData
      };
    }

    console.log('Payment verification successful');
    return {
      success: true,
      data: responseData.data
    };

  } catch (error) {
    console.error('=== Chapa Verification Error (Direct API) ===');
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        success: false,
        message: 'Network error: Unable to connect to Chapa API for verification.',
        details: { networkError: true }
      };
    }

    return {
      success: false,
      message: error?.message || 'Payment verification error',
      details: { 
        errorType: error?.name,
        originalMessage: error?.message
      }
    };
  }
};

/**
 * Get list of supported banks (if needed)
 */
export const getBanks = async () => {
  try {
    const response = await fetch('https://api.chapa.co/v1/banks', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const responseData = await response.json();
    
    if (!response.ok || responseData.status !== 'success') {
      return {
        success: false,
        message: responseData.message || 'Failed to fetch banks',
        details: responseData
      };
    }

    return {
      success: true,
      data: responseData.data
    };

  } catch (error) {
    console.error('Get banks error:', error);
    return {
      success: false,
      message: error?.message || 'Error fetching banks',
      details: { originalMessage: error?.message }
    };
  }
};