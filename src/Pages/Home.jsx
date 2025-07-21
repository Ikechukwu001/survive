import React from 'react';
import Hero from '../Components/Hero'
import HowItWorks from '../Components/HowItWorks'

export default function Home(){
  return (
    <main>
      <Hero />
      <HowItWorks />
      {/* You can add more sections like Categories, Plans, Footer, etc. */}
    </main>
  );
};

