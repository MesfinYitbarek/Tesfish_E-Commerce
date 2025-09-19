import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyRegistrationPayment } from "../../store/slices/productSlice";

const PaymentSuccessPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isRetrying, setIsRetrying] = useState(false);

  // Grab state from Redux slice
  const { status, message, registrationData, error } = useSelector((state) => state.products || {}
  );

  const verifyPayment = async (showRetryLoader = false) => {
    const tx_ref = searchParams.get("tx_ref");
    const trx_ref = searchParams.get("trx_ref");
    const transactionRef = tx_ref || trx_ref;

    if (!transactionRef) {
      // Dispatch failure directly
      return dispatch(
        verifyRegistrationPayment.rejected(
          new Error(
            "Missing transaction reference in the URL. Please check the payment link or contact support."
          ),
          ""
        )
      );
    }

    if (showRetryLoader) {
      setIsRetrying(true);
    }

    console.log("Verifying payment with tx_ref:", transactionRef);

    // Dispatch thunk action
    dispatch(
      verifyRegistrationPayment({
        id,
        tx_ref: transactionRef,
      })
    ).finally(() => {
      setIsRetrying(false);
    });
  };

  useEffect(() => {
    verifyPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, searchParams]);

  const handleRetry = () => {
    verifyPayment(true);
  };

  const handleGoToRegistrations = () => {
    navigate("/dashboard/registrations");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Verifying State */}
        {status === "loading" && (
          <div className="space-y-4">
            <LoadingSpinner />
            <h2 className="text-xl font-semibold text-gray-700">
              Verifying Payment...
            </h2>
            <p className="text-gray-500">
              Please wait while we confirm your transaction with the payment provider.
            </p>
            <div className="text-xs text-gray-400">
              This usually takes 10-30 seconds
            </div>
          </div>
        )}

        {/* Success State */}
        {status === "success" && (
          <div className="space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">
                Payment Successful!
              </h2>
              <p className="text-gray-600 leading-relaxed">{message}</p>
            </div>

            {registrationData && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="text-sm text-gray-600">Registration Details:</div>
                <div className="font-medium text-gray-800">
                  #{registrationData.registrationNumber}
                </div>
                {registrationData.property?.title && (
                  <div className="text-sm text-gray-600">
                    Property: {registrationData.property.title}
                  </div>
                )}
                <div className="text-sm text-green-600 font-medium">
                  Status:{" "}
                  {registrationData.status?.replace("-", " ")?.toUpperCase()}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleGoToRegistrations}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
              >
                View My Registrations
              </button>
              <button
                onClick={handleGoHome}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Go to Home
              </button>
            </div>
          </div>
        )}

        {/* Failed State */}
        {status === "failed" && (
          <div className="space-y-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-red-600 mb-2">
                Payment Verification Failed
              </h2>
              <p className="text-gray-600 leading-relaxed">{message || error}</p>
            </div>

            {registrationData && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="text-sm text-gray-600">Registration Details:</div>
                <div className="font-medium text-gray-800">
                  #{registrationData.registrationNumber}
                </div>
                <div className="text-sm text-red-600 font-medium">
                  Status:{" "}
                  {registrationData.status?.replace("-", " ")?.toUpperCase()}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isRetrying ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Retrying...</span>
                  </>
                ) : (
                  <span>Retry Verification</span>
                )}
              </button>

              <button
                onClick={handleGoToRegistrations}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                View My Registrations
              </button>

              <button
                onClick={handleGoHome}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Go to Home
              </button>
            </div>

            <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
              <p className="mb-1">Need help?</p>
              <p>
                Contact our support team with your registration number for
                assistance.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
