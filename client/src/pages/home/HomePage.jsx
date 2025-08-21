import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import HeroSection from '../../components/home/HeroSection';
import FeaturedProperties from '../../components/home/FeaturedProperties';
import ServicesShowcase from '../../components/home/ServicesShowcase';
import StatsSection from '../../components/home/StatsSection';
import TestimonialsSection from '../../components/home/TestimonialsSection';
import CategoryShowcase from '../../components/home/CategoryShowcase';
import RecentListings from '../../components/home/RecentListings';
import NewsletterSection from '../../components/home/NewsletterSection';
import CallToActionSection from '../../components/home/CallToActionSection';
import { setLoading } from '../../store/slices/uiSlice';

const HomePage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Set page loading state
    dispatch(setLoading({ key: 'global', value: true }));
    
    // Simulate loading completion
    const timer = setTimeout(() => {
      dispatch(setLoading({ key: 'global', value: false }));
    }, 500);

    return () => clearTimeout(timer);
  }, [dispatch]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Featured Properties */}
      <FeaturedProperties />
      
      {/* Category Showcase */}
      <CategoryShowcase />
      
      {/* Services Showcase */}
      <ServicesShowcase />
      
      {/* Stats Section */}
      {/* <StatsSection /> */}
      
      {/* Recent Listings */}
      <RecentListings />
      
      {/* Testimonials */}
      <TestimonialsSection />
      
      {/* Call to Action */}
      <CallToActionSection />
      
      {/* Newsletter */}
      {/* <NewsletterSection /> */}
    </div>
  );
};

export default HomePage;