import React from 'react';
import { ShoppingCart, User, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <img 
              src="/assets/images/logo.png" 
              alt="EveryDayNeed" 
              className="h-8 w-auto"
            />
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/notifications" className="p-2 text-gray-600 hover:text-[#FF3FE0]">
              <Bell className="h-6 w-6" />
            </Link>
            <Link to="/cart" className="p-2 text-gray-600 hover:text-[#FF3FE0]">
              <ShoppingCart className="h-6 w-6" />
            </Link>
            <Link to="/profile" className="p-2 text-gray-600 hover:text-[#FF3FE0]">
              <User className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};