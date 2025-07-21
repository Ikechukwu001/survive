// src/components/HowItWorks.jsx
import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    icon: "💰",
    title: "Start with ₦10,000",
    description: "You get a small budget. Will it last you a week?",
  },
  {
    icon: "🛍️",
    title: "Make Daily Choices",
    description: "Food, transport, airtime... choose wisely.",
  },
  {
    icon: "🎲",
    title: "Face Random Events",
    description: "Unexpected bills and surprises await you.",
  },
  {
    icon: "🧠",
    title: "Survive 7 Days",
    description: "If your ₦10k runs out, you lose the game.",
  },
];

function HowItWorks() {
  return (
    <section className="py-12 px-6 bg-white text-black">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
        How It Works
      </h2>

      <motion.div
        className="flex overflow-x-auto gap-4 px-2 no-scrollbar"
        initial={{ x: 100 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 40 }}
      >
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="min-w-[260px] sm:min-w-[300px] p-6 rounded-xl shadow-lg bg-[#f4fdf4] flex-shrink-0"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-4xl mb-4">{step.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
            <p className="text-sm text-gray-700">{step.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export default HowItWorks;
