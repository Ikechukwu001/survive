import React from 'react';
import Hero from '../Components/Hero'
import HowItWorks from '../Components/HowItWorks'
import Testimonials from '../Components/Testimonial';
import Leaderboard from '../Components/Leaderboard';
import Footer from '../Components/Footer';
import BackToTopButton from '../Components/BacktoTop';


export default function Home(){
  return (
    <main>
      <Hero />
      <HowItWorks />
      <Testimonials />
      <Leaderboard />
      <Footer />
      <BackToTopButton />
    </main>
  );
};

