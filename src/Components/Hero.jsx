// src/components/Hero.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section className="min-h-screen bg-[#0f0f0f] text-white px-6 py-16 flex items-center justify-center">
      <div className="max-w-5xl w-full text-center space-y-6">
        <h1 className="text-5xl md:text-7xl font-black leading-tight text-yellow-400 drop-shadow-lg">
          ₦10,000?
        </h1>
        <p className="text-2xl md:text-3xl font-semibold text-white">
          Let's be honest, that's *mad low*. But watch how we still pull it off.
        </p>
        <p className="text-md md:text-lg text-gray-300">
          We break it down — transport, food, data, enjoyment. 10k can stretch if you play your cards right 😉
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link
            to="/start"
            className="bg-yellow-400 text-black px-6 py-3 rounded-full font-bold hover:bg-yellow-300 transition duration-200"
          >
            Let’s Survive
          </Link>
          <Link
            to="/plans"
            className="border border-yellow-400 text-yellow-400 px-6 py-3 rounded-full font-bold hover:bg-yellow-400 hover:text-black transition duration-200"
          >
            Show Me Plans
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
