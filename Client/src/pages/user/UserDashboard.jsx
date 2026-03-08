import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  TicketIcon, 
  BuildingLibraryIcon, 
  HeartIcon,
  CalendarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import UserLayout from '../../components/layout/UserLayout';
import Card from '../../components/common/Card';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingBookings: 0,
    totalDonations: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [bookingsRes, donationsRes] = await Promise.all([
        userService.getUserBookings(user.id),
        userService.getUserDonations(user.id),
      ]);

      const bookings = bookingsRes.data || [];
      const donations = donationsRes.data || [];

      const upcoming = bookings.filter(
        b => new Date(b.darshanDate) > new Date() && b.status === 'confirmed'
      );

      setStats({
        totalBookings: bookings.length,
        upcomingBookings: upcoming.length,
        totalDonations: donations.reduce((sum, d) => sum + d.amount, 0),
      });

      setRecentBookings(bookings.slice(0, 5));
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: TicketIcon,
      color: '#3B82F6',
      link: '/user/bookings',
    },
    {
      title: 'Upcoming Visits',
      value: stats.upcomingBookings,
      icon: CalendarIcon,
      color: '#10B981',
      link: '/user/bookings',
    },
    {
      title: 'Total Donations',
      value: `₹${stats.totalDonations}`,
      icon: HeartIcon,
      color: '#EC4899',
      link: '/user/donations',
    },
  ];

  if (loading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-64">
          <div className="spinner" />
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 🙏
          </h1>
          <p className="text-gray-600">
            Manage your temple visits and bookings
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={stat.link}>
                <Card hover className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center"
                      style={{ background: stat.color }}
                    >
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/temples"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
              className="flex items-center gap-4 p-4 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <BuildingLibraryIcon className="w-8 h-8" />
              <div>
                <p className="font-semibold">Browse Temples</p>
                <p className="text-sm opacity-80">Find temples near you</p>
              </div>
              <ArrowRightIcon className="w-5 h-5 ml-auto" />
            </Link>

            <Link
              to="/user/bookings"
              style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              }}
              className="flex items-center gap-4 p-4 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <TicketIcon className="w-8 h-8" />
              <div>
                <p className="font-semibold">My Bookings</p>
                <p className="text-sm opacity-80">View your tickets</p>
              </div>
              <ArrowRightIcon className="w-5 h-5 ml-auto" />
            </Link>
          </div>
        </Card>

        {/* Recent Bookings */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
            <Link to="/user/bookings" className="text-primary font-medium hover:underline">
              View All
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="text-center py-8">
              <TicketIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No bookings yet</p>
              <Link
                to="/temples"
                className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Book Your First Darshan
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <BuildingLibraryIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{booking.templeName}</p>
                      <p className="text-sm text-gray-600">{booking.darshanName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(booking.darshanDate).toLocaleDateString()}
                    </p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
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
    </UserLayout>
  );
};

export default UserDashboard;
