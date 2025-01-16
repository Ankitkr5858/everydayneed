import React, { useState } from 'react';
import { useAuthStore } from '../../store/auth';
import { useNavigate } from 'react-router-dom';

export const UserAuth = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { signInWithPhone, verifyOTP, otpSent } = useAuthStore();
  const navigate = useNavigate();

  const formatPhoneNumber = (phone: string) => {
    // Remove any non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // If it's a 10-digit number, add +91 prefix
    if (digits.length === 10) {
      return `+91${digits}`;
    }
    
    throw new Error('Please enter a valid 10-digit mobile number');
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const formattedPhone = formatPhoneNumber(phone);
      await signInWithPhone(formattedPhone);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const formattedPhone = formatPhoneNumber(phone);
      await verifyOTP(formattedPhone, otp);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid OTP');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          src="/assets/images/logo.png"
          alt="EveryDayNeed"
          className="mx-auto h-16 w-auto"
        />
        <h2 className="mt-6 text-center text-4xl font-bold text-gray-900">
          {otpSent ? 'Enter OTP' : 'Sign in with Phone'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-xl sm:px-10">
          {!otpSent ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label className="form-label">Phone Number</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">+91</span>
                  </div>
                  <input
                    type="tel"
                    pattern="[0-9]{10}"
                    required
                    value={phone}
                    onChange={(e) => {
                      // Only allow numbers and limit to 10 digits
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setPhone(value);
                    }}
                    className="input-field pl-12"
                    placeholder="Enter 10-digit mobile number"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Enter your 10-digit mobile number without country code
                </p>
              </div>

              {error && (
                <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full btn-primary"
                disabled={phone.length !== 10}
              >
                Send OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label className="form-label">Enter OTP</label>
                <input
                  type="text"
                  pattern="[0-9]{6}"
                  required
                  value={otp}
                  onChange={(e) => {
                    // Only allow numbers and limit to 6 digits
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtp(value);
                  }}
                  className="input-field"
                  placeholder="Enter 6-digit OTP"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Enter the 6-digit code sent to your phone
                </p>
              </div>

              {error && (
                <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full btn-primary"
                disabled={otp.length !== 6}
              >
                Verify OTP
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleSendOTP}
                  className="text-[#FF3FE0] hover:text-[#e935c7] text-sm font-medium"
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};