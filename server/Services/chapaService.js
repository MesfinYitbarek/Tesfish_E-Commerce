// backend/services/chapaService.js
import { Chapa } from 'chapa-nodejs';

const chapa = new Chapa({
  secretKey: process.env.CHAPA_SECRET_KEY
});

/**
 * Initiate a payment using chapa-nodejs SDK
 * returns { success: boolean, data?, message? }
 */
export const initiateChapa = async ({ tx_ref, amount, currency = 'ETB', email, firstName, lastName, phone, callbackUrl, returnUrl, customization = {} }) => {
  try {
    console.log('Initiating Chapa payment with payload:', {
      tx_ref,
      amount,
      currency,
      email,
      firstName,
      lastName,
      phone,
      callbackUrl,
      returnUrl
    });

    const payload = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone_number: phone,
      currency,
      amount: String(amount),
      tx_ref,
      callback_url: callbackUrl,
      return_url: returnUrl,
      customization: {
        title: customization.title || 'Property Registration',
        description: customization.description || 'Property registration payment',
        ...customization
      }
    };

    console.log('Chapa initialization payload:', payload);

    const res = await chapa.initialize(payload);
    console.log('Chapa response:', res);

    // res: { message, status, data: { checkout_url } }
    if (!res || res.status !== 'success') {
      console.error('Chapa initialization failed:', res);
      return { 
        success: false, 
        message: res?.message || 'Chapa initialization failed',
        details: res 
      };
    }

    return { success: true, data: res.data };
  } catch (err) {
    console.error('initiateChapa error details:', {
      message: err?.message,
      response: err?.response?.data,
      stack: err?.stack,
      fullError: JSON.stringify(err, Object.getOwnPropertyNames(err))
    });

    // Handle different types of errors
    let errorMessage = 'Chapa initiation error';
    
    if (err?.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err?.message) {
      errorMessage = err.message;
    } else if (typeof err === 'string') {
      errorMessage = err;
    }

    return { 
      success: false, 
      message: errorMessage,
      details: err?.response?.data || err?.message || 'Unknown error'
    };
  }
};

/**
 * Verify a payment
 * returns { success: boolean, data?, message? }
 */
export const verifyChapa = async (tx_ref) => {
  try {
    console.log('Verifying Chapa payment:', tx_ref);

    const res = await chapa.verify({ tx_ref });
    console.log('Chapa verification response:', res);

    // res: { message, status, data }
    if (!res || res.status !== 'success') {
      console.error('Chapa verification failed:', res);
      return { 
        success: false, 
        message: res?.message || 'Chapa verification failed',
        details: res 
      };
    }
    
    return { success: true, data: res.data };
  } catch (err) {
    console.error('verifyChapa error details:', {
      message: err?.message,
      response: err?.response?.data,
      stack: err?.stack,
      fullError: JSON.stringify(err, Object.getOwnPropertyNames(err))
    });

    let errorMessage = 'Chapa verification error';
    
    if (err?.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err?.message) {
      errorMessage = err.message;
    }

    return { 
      success: false, 
      message: errorMessage,
      details: err?.response?.data || err?.message || 'Unknown error'
    };
  }
};