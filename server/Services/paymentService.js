import axios from "axios";

const CHAPA_BASE_URL = "https://api.chapa.co/v1";
const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;

/**
 * Initiate a payment
 */
export const initiatePayment = async (paymentData) => {
  try {
    const payload = {
      amount: paymentData.amount,
      currency: "ETB",
      email: paymentData.email,
      first_name: paymentData.firstName,
      last_name: paymentData.lastName,
      phone_number: paymentData.phone,
      tx_ref: `tx-${Date.now()}-${Math.floor(Math.random() * 10000)}`, // unique reference
      callback_url: paymentData.callbackUrl,
      return_url: paymentData.returnUrl,
      customization: {
        title: "Payment",
        description: "Payment transaction",
      },
    };

    const response = await axios.post(
      `${CHAPA_BASE_URL}/transaction/initialize`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status === "success") {
      return {
        success: true,
        data: {
          checkoutUrl: response.data.data.checkout_url,
          tx_ref: payload.tx_ref,
        },
      };
    }

    return { success: false, message: response.data.message || "Payment init failed" };
  } catch (error) {
    console.error("Chapa initiate payment error:", error.response?.data || error.message);
    return { success: false, message: "Payment initiation error" };
  }
};

/**
 * Verify a payment
 */
export const verifyPayment = async (tx_ref) => {
  try {
    const response = await axios.get(
      `${CHAPA_BASE_URL}/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
        },
      }
    );

    if (response.data.status === "success") {
      return { success: true, data: response.data.data };
    }

    return { success: false, message: response.data.message || "Verification failed" };
  } catch (error) {
    console.error("Chapa verify payment error:", error.response?.data || error.message);
    return { success: false, message: "Payment verification error" };
  }
};
