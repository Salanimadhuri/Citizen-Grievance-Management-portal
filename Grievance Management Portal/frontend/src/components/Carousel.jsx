import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, UserPlus, FileText, Eye, CheckCircle } from 'lucide-react';

const Carousel = ({
  baseWidth = 300,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = false,
  round = false
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const slides = [
    {
      icon: UserPlus,
      title: "Register or Sign In",
      description: "Create your account or log in to access the platform and start reporting issues in your community.",
      color: "bg-blue-100 text-blue-700"
    },
    {
      icon: FileText,
      title: "Submit Complaint",
      description: "Report your civic issue with detailed description, location information, and supporting images.",
      color: "bg-green-100 text-green-700"
    },
    {
      icon: Eye,
      title: "Authorities Review",
      description: "Relevant government authorities review your complaint and assign it to the appropriate department.",
      color: "bg-purple-100 text-purple-700"
    },
    {
      icon: CheckCircle,
      title: "Track Progress",
      description: "Monitor the resolution progress in real-time and receive updates until your issue is completely resolved.",
      color: "bg-orange-100 text-orange-700"
    }
  ];

  useEffect(() => {
    if (autoplay && !isHovered) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => 
          loop ? (prev + 1) % slides.length : 
          prev < slides.length - 1 ? prev + 1 : 0
        );
      }, autoplayDelay);

      return () => clearInterval(interval);
    }
  }, [autoplay, autoplayDelay, isHovered, loop, slides.length]);

  const nextSlide = () => {
    setCurrentSlide(prev => 
      loop ? (prev + 1) % slides.length : 
      prev < slides.length - 1 ? prev + 1 : prev
    );
  };

  const prevSlide = () => {
    setCurrentSlide(prev => 
      loop ? (prev - 1 + slides.length) % slides.length : 
      prev > 0 ? prev - 1 : prev
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center"
      onMouseEnter={() => pauseOnHover && setIsHovered(true)}
      onMouseLeave={() => pauseOnHover && setIsHovered(false)}
    >
      {/* Main slide container */}
      <div 
        className={`relative bg-white shadow-xl border border-gray-200 p-8 text-center transition-all duration-500 ${round ? 'rounded-full' : 'rounded-2xl'}`}
        style={{ width: baseWidth, minHeight: '400px' }}
      >
        <div className={`${slides[currentSlide].color} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6`}>
          {React.createElement(slides[currentSlide].icon, { size: 40 })}
        </div>
        
        <div className="mb-4">
          <span className="text-3xl font-bold text-primary-700">
            {String(currentSlide + 1).padStart(2, '0')}
          </span>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          {slides[currentSlide].title}
        </h3>
        
        <p className="text-gray-600 leading-relaxed">
          {slides[currentSlide].description}
        </p>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        disabled={!loop && currentSlide === 0}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={24} className="text-gray-700" />
      </button>

      <button
        onClick={nextSlide}
        disabled={!loop && currentSlide === slides.length - 1}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight size={24} className="text-gray-700" />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-primary-700' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;