import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  BuildingLibraryIcon, 
  CalendarIcon, 
  TicketIcon,
  CurrencyRupeeIcon,
  PlusIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import OrganizerLayout from '../../components/layout/OrganizerLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { organizerService } from '../../services/organizerService';
import { useAuth } from '../../context/AuthContext';

const OrganizerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTemples: 0,
    totalDarshans: 0,
    totalBookings: 0,
    totalRevenue: 0,
    recentBookings: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await organizerService.getStats();
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'My Temples',
      value: stats.totalTemples,
      icon: BuildingLibraryIcon,
      color: 'from-blue-500 to-blue-600',
      link: '/organizer/temples',
    },
    {
      title: 'Darshan Slots',
      value: stats.totalDarshans,
      icon: CalendarIcon,
      color: 'from-purple-500 to-purple-600',
      link: '/organizer/darshans',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: TicketIcon,
      color: 'from-green-500 to-green-600',
      link: '/organizer/bookings',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue}`,
      icon: CurrencyRupeeIcon,
      color: 'from-orange-500 to-orange-600',
      link: '/organizer/bookings',
    },
  ];

  if (loading) {
    return (
      <OrganizerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="spinner" />
        </div>
      </OrganizerLayout>
    );
  }

  return (
    <OrganizerLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user?.name}! 🙏
          </h1>
          <p className="text-gray-600">
            Manage your temples and darshan bookings
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={stat.link}>
                <Card hover className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/organizer/temple/create"
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-secondary to-secondary-light text-white rounded-xl hover:shadow-lg transition-all"
            >
              <PlusIcon className="w-8 h-8" />
              <div>
                <p className="font-semibold">Add Temple</p>
                <p className="text-sm text-white/80">Register new temple</p>
              </div>
            </Link>

            <Link
              to="/organizer/darshan/create"
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <PlusIcon className="w-8 h-8" />
              <div>
                <p className="font-semibold">Add Darshan</p>
                <p className="text-sm text-white/80">Create new slot</p>
              </div>
            </Link>

            <Link
              to="/organizer/event/create"
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <PlusIcon className="w-8 h-8" />
              <div>
                <p className="font-semibold">Add Event</p>
                <p className="text-sm text-white/80">Create temple event</p>
              </div>
            </Link>
          </div>
        </Card>

        {/* Recent Bookings */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
            <Link to="/organizer/bookings" className="text-secondary font-medium hover:underline">
              View All
            </Link>
          </div>

          {stats.recentBookings && stats.recentBookings.length === 0 ? (
            <div className="text-center py-8">
              <TicketIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No bookings yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentBookings?.map((booking) => (
                <div
                  key={booking._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{booking.userName}</p>
                    <p className="text-sm text-gray-600">{booking.templeName} - {booking.darshanName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">₹{booking.totalAmount}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </OrganizerLayout>
  );
};

export default OrganizerDashboard;
