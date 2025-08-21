import { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  StarIcon,
  PlayIcon, 
  PauseIcon,
} from '@heroicons/react/24/solid';
import { 
  ChatBubbleLeftIcon,
  MapPinIcon,
  CalendarIcon,
  CheckBadgeIcon,
  FireIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const progressRef = useRef(null);

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Mohammed',
      role: 'Property Buyer',
      company: 'Small Business Owner',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b851?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      content: 'CitiLights transformed our property search experience completely. The platform is incredibly user-friendly, and the property listings are detailed and accurate. We found our perfect villa in Bole within just two weeks!',
      propertyType: 'Villa Purchase',
      location: 'Bole, Addis Ababa',
      date: 'March 2024',
      featured: true,
      verified: true,
      projectValue: '18M ETB',
      satisfaction: 5,
      videoTestimonial: true
    },
    {
      id: 2,
      name: 'Michael Tesfaye',
      role: 'Real Estate Developer',
      company: 'Sunshine Properties',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      content: 'As a real estate company, CitiLights has been instrumental in helping us reach more customers. The professional tools and analytics have significantly improved our sales performance.',
      propertyType: 'Commercial Listing',
      location: 'Multiple Locations',
      date: 'February 2024',
      featured: false,
      verified: true,
      projectValue: '150M ETB',
      satisfaction: 5,
      videoTestimonial: false
    },
    {
      id: 3,
      name: 'Rahel Bekele',
      role: 'Interior Designer',
      company: 'Creative Spaces Design',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      content: 'The service marketplace on CitiLights connected me with so many amazing clients. The project management tools make it incredibly easy to manage multiple design projects simultaneously.',
      propertyType: 'Interior Design Services',
      location: 'Addis Ababa',
      date: 'January 2024',
      featured: true,
      verified: true,
      projectValue: '5M ETB',
      satisfaction: 5,
      videoTestimonial: true
    },
    {
      id: 4,
      name: 'David Wilson',
      role: 'Expatriate',
      company: 'International NGO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      rating: 4,
      content: 'Moving to Ethiopia was made so much easier with CitiLights. I found a fully furnished apartment in Kazanchis that met all my requirements perfectly.',
      propertyType: 'Apartment Rental',
      location: 'Kazanchis, Addis Ababa',
      date: 'December 2023',
      featured: false,
      verified: true,
      projectValue: '2.5M ETB',
      satisfaction: 4,
      videoTestimonial: false
    },
    {
      id: 5,
      name: 'Almaz Girma',
      role: 'First-time Buyer',
      company: 'Healthcare Professional',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      content: 'Being a first-time buyer, I was nervous about the entire process. The CitiLights team provided excellent guidance and connected me with trustworthy agents.',
      propertyType: 'Apartment Purchase',
      location: 'Gerji, Addis Ababa',
      date: 'November 2023',
      featured: true,
      verified: true,
      projectValue: '7.5M ETB',
      satisfaction: 5,
      videoTestimonial: false
    },
    {
      id: 6,
      name: 'John Haile',
      role: 'Construction Manager',
      company: 'BuildRight Construction',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      content: 'The project management services through CitiLights have completely streamlined our construction processes. The platform connects us with skilled professionals effectively.',
      propertyType: 'Construction Services',
      location: 'Various Projects',
      date: 'October 2023',
      featured: false,
      verified: true,
      projectValue: '25M ETB',
      satisfaction: 5,
      videoTestimonial: true
    }
  ];

  const totalTestimonials = testimonials.length;
  const autoPlayInterval = 7000;

  useEffect(() => {
    if (!isAutoPlaying || isPaused) return;

    const startAutoPlay = () => {
      intervalRef.current = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % totalTestimonials);
        setProgress(0);
      }, autoPlayInterval);

      progressRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 0;
          }
          return prev + (100 / (autoPlayInterval / 100));
        });
      }, 100);
    };

    startAutoPlay();

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(progressRef.current);
    };
  }, [isAutoPlaying, isPaused, totalTestimonials, currentTestimonial]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % totalTestimonials);
    setProgress(0);
    pauseAutoPlay();
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + totalTestimonials) % totalTestimonials);
    setProgress(0);
    pauseAutoPlay();
  };

  const goToTestimonial = (index) => {
    setCurrentTestimonial(index);
    setProgress(0);
    pauseAutoPlay();
  };

  const pauseAutoPlay = () => {
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 3000);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
    setProgress(0);
  };

  const currentData = testimonials[currentTestimonial];

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-5 w-48 h-48 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-5 w-48 h-48 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium mb-3">
            <SparklesIcon className="h-3 w-3 mr-1" />
            Customer Stories
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            What Our Customers Say
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what real customers have to say 
            about their transformative experience with CitiLights.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Main Testimonial Display */}
          <div className="relative">
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 lg:p-8 mt-2 relative border border-gray-100 dark:border-gray-700">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                {/* Customer Info */}
                <div className="text-center lg:text-left">
                  <div className="relative inline-block mb-4">
                    <img
                      src={currentData.image}
                      alt={currentData.name}
                      className="w-16 h-16 rounded-full mx-auto lg:mx-0 object-cover border-4 border-gradient-to-r from-blue-500 to-purple-600 p-1"
                    />
                    {currentData.verified && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                        <CheckBadgeIcon className="h-4 w-4 text-white" />
                      </div>
                    )}
                    {currentData.videoTestimonial && (
                      <div className="absolute top-0 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <PlayIcon className="h-2 w-2 text-white" />
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {currentData.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm mb-1">
                    {currentData.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs mb-3">
                    {currentData.company}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center justify-center lg:justify-start mb-4">
                    <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 ${
                            i < currentData.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                        {currentData.rating}.0
                      </span>
                    </div>
                    {currentData.featured && (
                      <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400 text-xs font-bold rounded-full flex items-center">
                        <FireIcon className="h-2 w-2 mr-1" />
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Project Details */}
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 text-xs space-y-2">
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Type:</span>
                        <span className="text-gray-600 dark:text-gray-400 font-semibold">
                          {currentData.propertyType}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Location:</span>
                        <span className="text-gray-600 dark:text-gray-400 flex items-center">
                          <MapPinIcon className="h-3 w-3 mr-1" />
                          {currentData.location}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Date:</span>
                        <span className="text-gray-600 dark:text-gray-400 flex items-center">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          {currentData.date}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Value:</span>
                        <span className="text-blue-600 dark:text-blue-400 font-bold">
                          {currentData.projectValue}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Testimonial Content */}
                <div className="lg:col-span-2">
                  <div className="mb-4">
                    <div className="flex items-center mb-3">
                      <div className="flex items-center space-x-2">
                        <ChatBubbleLeftIcon className="h-4 w-4 text-blue-500" />
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Customer Testimonial</span>
                      </div>
                    </div>
                    <blockquote className="text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-medium italic">
                      "{currentData.content}"
                    </blockquote>
                  </div>

                  {/* Satisfaction Meter */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Satisfaction Level</span>
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{currentData.satisfaction * 20}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${currentData.satisfaction * 20}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevTestimonial}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white dark:bg-gray-700 rounded-full shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 hover:scale-110"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <button
                onClick={nextTestimonial}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white dark:bg-gray-700 rounded-full shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 hover:scale-110"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center mt-8 space-y-6">
            {/* Testimonial Indicators */}
            <div className="flex justify-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`relative transition-all duration-300 ${
                    index === currentTestimonial
                      ? 'w-6 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full'
                      : 'w-2 h-2 bg-gray-300 dark:bg-gray-600 hover:bg-blue-300 dark:hover:bg-blue-700 rounded-full'
                  }`}
                >
                  {index === currentTestimonial && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 w-full max-w-3xl">
              {testimonials.map((testimonial, index) => (
                <button
                  key={testimonial.id}
                  onClick={() => goToTestimonial(index)}
                  className={`group relative bg-white dark:bg-gray-800 rounded-xl p-3 transition-all duration-300 transform hover:scale-105 ${
                    index === currentTestimonial
                      ? 'ring-2 ring-blue-500 shadow-lg scale-105 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20'
                      : 'hover:shadow-md border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="text-center">
                    <div className="relative inline-block mb-2">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-8 h-8 rounded-full mx-auto object-cover"
                      />
                      {testimonial.verified && (
                        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckBadgeIcon className="h-2 w-2 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-1">
                      {testimonial.name.split(' ')[0]}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {testimonial.role}
                    </div>
                    <div className="flex justify-center mb-1">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-2 w-2 ${
                            i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      {testimonial.projectValue}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Auto-play Controls */}
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleAutoPlay}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isAutoPlaying
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                }`}
              >
                {isAutoPlaying ? (
                  <PauseIcon className="h-3 w-3" />
                ) : (
                  <PlayIcon className="h-3 w-3" />
                )}
                <span>{isAutoPlaying ? 'Pause' : 'Play'} Auto-rotation</span>
              </button>
              
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {currentTestimonial + 1} of {totalTestimonials}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;