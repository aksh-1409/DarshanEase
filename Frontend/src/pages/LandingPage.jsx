import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  SparklesIcon, 
  ClockIcon, 
  ShieldCheckIcon, 
  HeartIcon,
  UserGroupIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const LandingPage = () => {
  const features = [
    {
      icon: ClockIcon,
      title: 'Easy Booking',
      description: 'Book your darshan slots in just a few clicks'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure Payments',
      description: 'Safe and encrypted payment processing'
    },
    {
      icon: CalendarIcon,
      title: 'Flexible Scheduling',
      description: 'Choose from multiple time slots'
    },
    {
      icon: HeartIcon,
      title: 'Donations',
      description: 'Contribute to temple development'
    },
    {
      icon: UserGroupIcon,
      title: 'Group Bookings',
      description: 'Book for family and friends together'
    },
    {
      icon: SparklesIcon,
      title: 'Special Events',
      description: 'Get notified about temple events'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <SparklesIcon className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                DarshanEase
              </span>
            </div>
            <div className="flex gap-4">
              <Link
                to="/login"
                className="px-6 py-2.5 text-primary font-semibold hover:bg-primary/10 rounded-lg transition-all"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2.5 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Your Spiritual Journey,
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {' '}Simplified
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Book temple darshan slots online with ease. Skip the queues and plan your spiritual visits seamlessly.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/signup"
                  className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Start Booking Now
                </Link>
                <Link
                  to="/temples"
                  className="px-8 py-4 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-white transition-all"
                >
                  Explore Temples
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"
                  alt="Temple"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose DarshanEase?
            </h2>
            <p className="text-xl text-gray-600">
              Experience hassle-free temple visits with our modern platform
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Begin Your Spiritual Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of devotees who trust DarshanEase for their temple visits
          </p>
          <Link
            to="/signup"
            className="inline-block px-10 py-4 bg-white text-primary font-bold rounded-xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <SparklesIcon className="w-8 h-8 text-primary" />
                <span className="text-xl font-bold">DarshanEase</span>
              </div>
              <p className="text-gray-400">
                Making temple visits easier and more accessible for everyone.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/temples" className="hover:text-white">Temples</Link></li>
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">For Organizers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/organizer/signup" className="hover:text-white">Register Temple</Link></li>
                <li><Link to="/organizer/login" className="hover:text-white">Organizer Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DarshanEase. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
