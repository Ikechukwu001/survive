// src/components/Hero.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import Money from '../assets/Money.json'
import { BarChart3, CalendarDays, Dice6 } from 'lucide-react';

function Hero() {
  return (
    <section className="min-h-screen bg-[#f4fdf4] text-black flex flex-col items-center justify-start px-6 py-10 space-y-10">
      
      {/* Lottie Animation */}
      <div className="w-full max-w-sm mx-auto">
        <Lottie animationData={Money} loop={true} />
      </div>

      {/* Text Section */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold">Naija Hustle: Can You Last?</h1>
        <p className="text-gray-700 text-sm md:text-base max-w-md mx-auto">
          Test your financial savvy in this survival game. Can you make smart choices with a virtual budget to survive for 7 days?
        </p>
      </div>

      {/* Features */}
      <div className="space-y-4 text-left w-full max-w-xs">
        <div className="flex items-center gap-3">
          <div className="bg-[#e3f9e3] p-3 rounded-lg">
            <BarChart3 className="text-[#1c1c1c]" />
          </div>
          <span className="text-sm font-medium">Track Your Spending</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#e3f9e3] p-3 rounded-lg">
            <CalendarDays className="text-[#1c1c1c]" />
          </div>
          <span className="text-sm font-medium">Daily Challenges</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#e3f9e3] p-3 rounded-lg">
            <Dice6 className="text-[#1c1c1c]" />
          </div>
          <span className="text-sm font-medium">Random Events</span>
        </div>
      </div>

      {/* Call to Action Button */}
      <div className="w-full max-w-xs pt-4">
        <Link
          to="/start"
          className="block bg-[#00ff33] hover:bg-[#00e62b] text-black text-center py-4 text-lg font-semibold rounded-full transition-all"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
}

export default Hero;
