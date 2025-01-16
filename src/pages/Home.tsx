import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Store } from 'lucide-react';

export const Home = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1608686207856-001b95cf60ca?q=80&w=2940&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[#6225E3] bg-opacity-90"></div>
      </div>

      {/* Decorative circles */}
      <div className="absolute top-[-20%] right-[-10%] w-96 h-96 rounded-full bg-[#FF3FE0] blur-3xl opacity-30"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-96 h-96 rounded-full bg-[#00FF85] blur-3xl opacity-30"></div>
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="max-w-6xl w-full mx-auto text-center text-white z-10">
          <img 
            src="/assets/images/logo-white.png" 
            alt="EveryDayNeed" 
            className="h-24 mx-auto mb-12"
          />
          
          <h1 className="text-6xl md:text-8xl font-extrabold mb-8 leading-tight">
            Your Daily Essentials
            <br />
            <span className="text-[#FFD600]">Delivered in Minutes</span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-[#00FF85] mb-12 max-w-3xl mx-auto font-medium">
            Connect with local shops in your society and get fresh groceries delivered to your doorstep
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-xl mx-auto">
            <Link 
              to="/auth/user" 
              className="w-full sm:w-auto btn-primary flex items-center justify-center gap-3 text-xl"
            >
              <ShoppingBag className="h-6 w-6" />
              Shop Now
            </Link>
            
            <Link 
              to="/auth/vendor" 
              className="w-full sm:w-auto btn-secondary flex items-center justify-center gap-3 text-xl"
            >
              <Store className="h-6 w-6" />
              Register Shop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};