import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturedListings from '../components/FeaturedListings';
import WhyChooseUs from '../components/WhyChooseUs';
import HowItWorks from '../components/HowItWorks';
import ExploreCategories from '../components/ExploreCategories';
import CtaSection from '../components/CtaSection';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <HeroSection />
      <FeaturedListings />
      <WhyChooseUs />
      <HowItWorks />
      <ExploreCategories />
      <CtaSection />
    </div>
  );
};

export default LandingPage;