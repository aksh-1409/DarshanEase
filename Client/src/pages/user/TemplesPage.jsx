import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  BuildingLibraryIcon, 
  MapPinIcon, 
  ClockIcon,
  MagnifyingGlassIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import Card from '../../components/common/Card';
import { userService } from '../../services/userService';

const TemplesPage = () => {
  const [temples, setTemples] = useState([]);
  const [filteredTemples, setFilteredTemples] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemples();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = temples.filter(temple =>
        temple.templeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        temple.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTemples(filtered);
    } else {
      setFilteredTemples(temples);
    }
  }, [searchTerm, temples]);

  const fetchTemples = async () => {
    try {
      const response = await userService.getTemples();
      setTemples(response.data || []);
      setFilteredTemples(response.data || []);
    } catch (error) {
      toast.error('Failed to load temples');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div 
        className="text-white py-16"
        style={{ background: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-4 text-white">Explore Sacred Temples</h1>
            <p className="text-xl text-white mb-8" style={{ opacity: 0.9 }}>
              Find and book darshan slots at temples near you
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search temples by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Temples Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredTemples.length === 0 ? (
          <div className="text-center py-16">
            <BuildingLibraryIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600">
              {searchTerm ? 'No temples found matching your search' : 'No temples available'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemples.map((temple, index) => (
              <motion.div
                key={temple._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/temple/${temple._id}`}>
                  <Card hover className="overflow-hidden p-0">
                    <div className="relative h-48">
                      <img
                        src={`http://localhost:8000/${temple.templeImage}`}
                        alt={temple.templeName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-1">
                          {temple.templeName}
                        </h3>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <div className="flex items-start gap-2 text-gray-600">
                        <MapPinIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{temple.location}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <ClockIcon className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm">
                          {temple.darshanStartTime} - {temple.darshanEndTime}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2">
                        {temple.description}
                      </p>

                      <button 
                        className="w-full py-2 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                        style={{ background: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)' }}
                      >
                        View Darshan Slots
                      </button>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplesPage;
