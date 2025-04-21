import { useState } from "react";
import { CheckIcon, MoonIcon, BookOpenIcon, ClockIcon, BrainIcon, StarIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const SoonBadge = () => (
  <motion.div
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="absolute top-2 right-2 sm:top-3 sm:right-3 
               bg-purple-100 text-purple-800 text-xs font-bold 
               px-2.5 py-1 rounded-full border border-purple-200
               flex items-center gap-1.5 shadow-sm
               hover:bg-purple-50 transition-colors
               z-10"
  >
    <motion.span
      animate={{ rotate: [0, 15, 0] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="text-purple-600"
    >
      <ClockIcon className="w-3.5 h-3.5" />
    </motion.span>
    <span>Soon</span>
  </motion.div>
);

export default function ThimarLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: <ClockIcon className="w-6 h-6 text-purple-800" />,
      title: "Prayer-Time Centric Planning",
      description: "Schedule your day around salah times with automated adjustments for changing prayer schedules.",
      soon: false
    },
    {
      icon: <BookOpenIcon className="w-6 h-6 text-purple-800" />,
      title: "Ibadah Assistant",
      description: "Track Quran recitation, dhikr, prayers and other worship goals with personalized recommendations.",
      soon: false
    },
    {
      icon: <BrainIcon className="w-6 h-6 text-purple-800" />,
      title: "Deep Focus Mode",
      description: "Combine Pomodoro technique with Quran recitations for distraction-free productivity sessions.",
      soon: false
    },
    {
      icon: <StarIcon className="w-6 h-6 text-purple-800" />,
      title: "AI-Powered Insights",
      description: "Receive personalized recommendations based on your habits, goals and Islamic principles.",
      soon: false
    },
    {
      icon: <MoonIcon className="w-6 h-6 text-purple-800" />,
      title: "Habit Tracker",
      description: "Build consistency in both worldly tasks and spiritual practices with visual progress tracking.",
      soon: false
    },
    {
      icon: <CheckIcon className="w-6 h-6 text-purple-800" />,
      title: "Smart Task Automation",
      description: "Let AI handle routine tasks and organize your goals for balanced productivity.",
      soon: true
    }
  ];

  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started",
      features: [
        "Basic Task Management",
        "Prayer Time Integration",
        "5 AI Recommendations/Day",
        "Deep Focus Mode"
      ],
      cta: "Start Free",
      highlighted: false,
      soon: false
    },
    {
      name: "Blessed",
      price: "$9.99",
      description: "Our most popular plan",
      features: [
        "Advanced Task Management",
        "Unlimited AI Recommendations",
        "Complete Ibadah Assistant",
        "Advanced Deep Focus Mode",
        "Custom Habit Tracking"
      ],
      cta: "Begin Your Journey",
      highlighted: true,
      soon: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white overflow-x-hidden w-full">
      {/* Navigation */}
      <nav className="bg-white shadow sticky top-0 z-50 w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 max-w-7xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="Thimar Logo" className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg" />
              <span className="font-bold text-lg sm:text-xl md:text-2xl text-purple-800">Thimar</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
              <a href="#features" className="text-gray-600 hover:text-purple-800 text-sm md:text-base">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-purple-800 text-sm md:text-base">Pricing</a>
              <button className="bg-purple-100 text-purple-800 px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-medium hover:bg-purple-200 text-sm md:text-base transition-colors">
                <Link to="/login">Sign In</Link>
              </button>
              <button className="bg-purple-800 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-medium hover:bg-purple-900 text-sm md:text-base transition-colors">
                <Link to="/register">Get Started</Link>
              </button>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-500 hover:text-purple-800 focus:outline-none"
                aria-label="Toggle menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t">
              <div className="flex flex-col space-y-4 pb-3">
                <a 
                  href="#features" 
                  className="text-gray-600 hover:text-purple-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </a>
                <a 
                  href="#pricing" 
                  className="text-gray-600 hover:text-purple-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pricing
                </a>
                <button className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg font-medium hover:bg-purple-200 transition-colors">
                  <Link to="/login">Sign In</Link>
                </button>
                <button className="bg-purple-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-900 transition-colors">
                  <Link to="/register">Get Started</Link>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 md:pr-6 lg:pr-12 mb-8 md:mb-0">
            <div className="inline-block bg-purple-100 px-3 py-1 rounded-full text-purple-800 font-medium text-xs sm:text-sm mb-4 sm:mb-6">
              ✨ Now in Public Beta
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Productivity with <span className="text-purple-800">Islamic Purpose</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8">
              Thimar combines AI-powered productivity tools with Islamic principles to help you achieve balance and excellence in both worlds. Plan around prayer times, track worship goals, and stay focused with the only productivity app designed specifically for Muslims.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button className="bg-purple-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-purple-900 transition-colors text-sm sm:text-base w-full sm:w-auto">
                <Link to="/register">Start Your Blessed Journey</Link>
              </button>
              <button className="bg-white border border-purple-800 text-purple-800 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-purple-100 transition-colors text-sm sm:text-base w-full sm:w-auto">
                <Link to="/login">View Demo</Link>
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/2 mt-8 md:mt-0">
            <div className="relative max-w-md sm:max-w-lg mx-auto md:mx-0 md:max-w-full">
              <div className="absolute inset-0 bg-purple-300 rounded-3xl transform rotate-3"></div>
              <div className="bg-white p-1 rounded-3xl shadow-xl transform -rotate-2 relative">
                <video 
                  className="rounded-2xl w-full h-auto"
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                >
                  <source src="https://fagzgyrlxrpvniypexil.supabase.co/storage/v1/object/public/marketing//Thimar_overview1.mp4" type="video/mp4" />
                  <img 
                    src="/api/placeholder/600/400" 
                    alt="Thimar App Interface" 
                    className="rounded-2xl"
                  />
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-purple-100 py-8 sm:py-12 md:py-16 lg:py-20 w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Designed for the Muslim Lifestyle</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Every feature in Thimar is built to help you excel in both productivity and faith
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow relative overflow-visible">
                {feature.soon && <SoonBadge />}
                <div className="bg-purple-100 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg mb-3 sm:mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2">{feature.title}</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Preview */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <div className="relative max-w-md sm:max-w-lg mx-auto md:mx-0 md:max-w-full">
              <div className="absolute inset-0 bg-purple-300 rounded-3xl transform -rotate-3"></div>
              <div className="bg-white p-1 rounded-3xl shadow-xl transform rotate-2 relative">
                <video 
                  className="rounded-2xl w-full h-auto"
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                >
                  <source src="https://fagzgyrlxrpvniypexil.supabase.co/storage/v1/object/public/marketing//Thimar_overview2.mp4" type="video/mp4" />
                  <img 
                    src="/api/placeholder/600/400" 
                    alt="Thimar Task Management" 
                    className="rounded-2xl"
                  />
                </video>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 mt-8 md:mt-0 md:pl-6 lg:pl-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              AI that Understands Your Islamic Priorities
            </h2>
            <div className="space-y-4 sm:space-y-6">
              <div className="flex space-x-3 sm:space-x-4">
                <div className="bg-purple-100 w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center rounded-lg">
                  <CheckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-800" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1">Prayer-First Scheduling</h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600">Never miss a prayer with automatic schedule adjustments around salah times</p>
                </div>
              </div>
              
              <div className="flex space-x-3 sm:space-x-4">
                <div className="bg-purple-100 w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center rounded-lg">
                  <CheckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-800" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1">Worship Tracking</h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600">Set and achieve goals for Quran reading, dhikr, and voluntary prayers</p>
                </div>
              </div>
              
              <div className="flex space-x-3 sm:space-x-4">
                <div className="bg-purple-100 w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center rounded-lg">
                  <CheckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-800" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1">Islamic Deep Work</h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600">Focus better with Pomodoro timers featuring Quran recitation during breaks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20 max-w-7xl">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Simple, Blessed Pricing</h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that helps you grow in both worlds
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`${
                plan.highlighted 
                  ? 'border-purple-800 bg-white shadow-xl md:transform md:scale-105' 
                  : 'border-gray-200 bg-white shadow'
              } border-2 rounded-xl p-4 sm:p-6 lg:p-8 transition-all hover:shadow-lg relative w-full sm:w-3/4 md:w-5/12 lg:w-1/3`}
            >
              {plan.soon && <SoonBadge />}
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-purple-800 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-0.5 sm:py-1 rounded-full whitespace-nowrap">
                    Most affordable 
                  </div>
                </div>
              )}
              <div className="relative">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">{plan.name}</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4">{plan.description}</p>
                <div className="mb-4 sm:mb-6">
                  <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">{plan.soon ? '$$$' : plan.price}</span>
                  <span className="text-gray-500">/month</span> 
                </div>
                
                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-xs sm:text-sm md:text-base">
                      <CheckIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-800 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base ${
                    plan.soon 
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-80' 
                    : plan.highlighted 
                      ? 'bg-purple-800 text-white hover:bg-purple-900' 
                      : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                } disabled:opacity-75 disabled:cursor-not-allowed transition-colors`}
                disabled={plan.soon}
                >
                  {plan.soon ? <span>Coming Soon</span> : <Link to="/register">{plan.cta}</Link>}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-purple-800 text-white py-8 sm:py-12 md:py-16 w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-7xl">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">Begin Your Journey Towards Balanced Productivity</h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join thousands of Muslims who have transformed their productivity while strengthening their faith with Thimar.
          </p>
          <button className="bg-white text-purple-800 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-lg font-medium text-sm sm:text-base md:text-lg hover:bg-purple-100 transition-colors">
            <Link to="/register">Start Your Free Trial</Link>
          </button>
          <p className="mt-3 sm:mt-4 text-purple-200 text-xs sm:text-sm md:text-base">No credit card required. 30-day free trial.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-4 sm:py-6 text-center w-full">
        <div className="container mx-auto px-4 max-w-7xl">
          <p className="text-gray-400 text-xs sm:text-sm md:text-base">© 2025 Thimar. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}