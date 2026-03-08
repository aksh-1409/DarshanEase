import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  SparklesIcon,
  BuildingLibraryIcon,
  TicketIcon,
  HeartIcon,
  CalendarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const LandingPage = () => {
  const features = [
    {
      icon: BuildingLibraryIcon,
      title: 'Browse Temples',
      description: 'Explore hundreds of temples across India with detailed information',
    },
    {
      icon: TicketIcon,
      title: 'Book Darshan',
      description: 'Reserve your darshan slots online and skip the long queues',
    },
    {
      icon: CalendarIcon,
      title: 'Plan Visits',
      description: 'Schedule your spiritual journey with flexible time slots',
    },
    {
      icon: HeartIcon,
      title: 'Make Donations',
      description: 'Contribute to temple maintenance and development',
    },
  ];

  const temples = [
    { image: '/temple1.jpg', name: 'Book Darshan', subtitle: 'Reserve Your Slot' },
    { image: '/temple2.jpg', name: 'Virtual Queue', subtitle: 'Skip The Wait' },
    { image: '/temple3.jpg', name: 'Make Donations', subtitle: 'Contribute Online' },
    { image: '/temple4.jpg', name: 'Plan Visits', subtitle: 'Schedule Easily' },
  ];

  const benefits = [
    'Skip long queues with online booking',
    'Secure payment gateway',
    'Instant booking confirmation',
    'E-tickets on your phone',
    'Real-time slot availability',
    '24/7 customer support',
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #F7B801 100%)' }}
              >
                <SparklesIcon className="w-7 h-7 text-white" />
              </div>
              <span 
                className="text-2xl font-bold"
                style={{ 
                  background: 'linear-gradient(135deg, #FF6B35 0%, #F7B801 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                DarshanEase
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="px-6 py-2.5 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-all"
              >
                Login
              </Link>
              <Link
                to="/signup"
                style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #F7B801 100%)' }}
                className="px-6 py-2.5 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Temple Images */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle, #FF6B35 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6"
            >
              Your Spiritual Journey,
              <br />
              <span 
                style={{ 
                  background: 'linear-gradient(135deg, #FF6B35 0%, #F7B801 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Simplified
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto"
            >
              Book temple darshan slots online with ease. Skip the queues and plan your spiritual visits seamlessly across India's most sacred temples.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link
                to="/signup"
                style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #F7B801 100%)' }}
                className="px-10 py-4 text-white font-bold text-lg rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center gap-2"
              >
                Start Booking Now
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
              <Link
                to="/temples"
                style={{ border: '2px solid #FF6B35', color: '#FF6B35' }}
                className="px-10 py-4 font-bold text-lg rounded-xl hover:text-white transition-all flex items-center gap-2"
                onMouseEnter={(e) => e.target.style.background = '#FF6B35'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                Explore Temples
                <BuildingLibraryIcon className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>

          {/* Temple Images Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {temples.map((temple, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="relative group overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={temple.image}
                    alt={temple.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'linear-gradient(to top, rgba(255,107,53,0.95) 0%, rgba(0,0,0,0.3) 100%)' }}
                  >
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                      <p className="text-white font-bold text-2xl mb-1">{temple.name}</p>
                      <p className="text-white/90 text-sm font-medium">{temple.subtitle}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose DarshanEase?</h2>
            <p className="text-xl text-gray-600">Experience hassle-free temple visits with our modern platform</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #F7B801 100%)' }}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Everything You Need for a Perfect Temple Visit
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of devotees who trust DarshanEase for their spiritual journeys
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircleIcon className="w-6 h-6 flex-shrink-0" style={{ color: '#10B981' }} />
                    <span className="text-gray-700 text-lg">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="/temple1.jpg"
                  alt="Temple"
                  className="rounded-2xl shadow-xl w-full h-64 object-cover"
                />
                <img
                  src="/temple2.jpg"
                  alt="Temple"
                  className="rounded-2xl shadow-xl w-full h-64 object-cover mt-8"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section 
        className="py-20 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #F7B801 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-xl opacity-90">Temples Listed</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-bold mb-2">50K+</div>
              <div className="text-xl opacity-90">Happy Devotees</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-bold mb-2">100K+</div>
              <div className="text-xl opacity-90">Bookings Completed</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to Begin Your Spiritual Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-10">
              Join DarshanEase today and experience the future of temple visits
            </p>
            <Link
              to="/signup"
              style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #F7B801 100%)' }}
              className="inline-flex items-center gap-2 px-10 py-4 text-white font-bold text-lg rounded-xl hover:shadow-2xl transition-all transform hover:scale-105"
            >
              Get Started Free
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #F7B801 100%)' }}
                >
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">DarshanEase</span>
              </div>
              <p className="text-gray-400">Your trusted partner for spiritual journeys</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/temples" className="hover:text-white transition-colors">Browse Temples</Link></li>
                <li><Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">For Organizers</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/signup" className="hover:text-white transition-colors">Register Temple</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Organizer Login</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DarshanEase. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
