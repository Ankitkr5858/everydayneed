import React from 'react';
import { Link } from 'react-router-dom';

export const AuthChoice = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          src="/assets/images/logo.png"
          alt="EveryDayNeed"
          className="mx-auto h-12 w-auto"
        />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Welcome to EveryDayNeed
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Choose how you want to continue
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-4">
            <Link
              to="/auth/user"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#00b37d] hover:bg-[#009668] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00b37d]"
            >
              Continue as Customer
            </Link>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>
            <Link
              to="/auth/vendor"
              className="w-full flex justify-center py-3 px-4 border-2 border-[#00b37d] rounded-md shadow-sm text-sm font-medium text-[#00b37d] bg-white hover:bg-[#00b37d] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00b37d]"
            >
              Continue as Vendor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};