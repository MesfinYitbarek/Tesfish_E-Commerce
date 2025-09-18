import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentSuccessPage = () => {
  const { id } = useParams(); // registrationId from route
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("verifying"); // verifying | success | failed
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const tx_ref = searchParams.get("tx_ref");
        if (!tx_ref) {
          setStatus("failed");
          setMessage("Missing transaction reference.");
          return;
        }

        setStatus("verifying");
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/property-registrations/${id}/verify-payment`,
          { tx_ref },
          { withCredentials: true }
        );

        if (res.data.success) {
          setStatus("success");
          setMessage("Payment verified successfully. Your registration is under review.");
        } else {
          setStatus("failed");
          setMessage(res.data.message || "Payment verification failed.");
        }
      } catch (err) {
        setStatus("failed");
        setMessage(err.response?.data?.message || "Server error while verifying payment.");
      }
    };

    verifyPayment();
  }, [id, searchParams]);

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {status === "verifying" && (
          <>
            <h2 className="text-xl font-semibold text-gray-700">Verifying Payment...</h2>
            <p className="text-gray-500 mt-2">Please wait while we confirm your transaction.</p>
          </>
        )}

        {status === "success" && (
          <>
            <h2 className="text-2xl font-bold text-green-600">🎉 Payment Successful!</h2>
            <p className="text-gray-600 mt-2">{message}</p>
            <button
              onClick={handleGoHome}
              className="mt-6 px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
            >
              Go to Home
            </button>
          </>
        )}

        {status === "failed" && (
          <>
            <h2 className="text-2xl font-bold text-red-600">❌ Payment Failed</h2>
            <p className="text-gray-600 mt-2">{message}</p>
            <button
              onClick={handleGoHome}
              className="mt-6 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
            >
              Try Again / Home
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
