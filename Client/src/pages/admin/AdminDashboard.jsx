import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  UsersIcon, 
  UserGroupIcon, 
  BuildingLibraryIcon,
  TicketIcon,
  CurrencyRupeeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/common/Card';
import { adminService } from '../../services/adminService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrganizers: 0,
    totalTemples: 0,
    totalBookings: 0,
    totalDonations: 0,
    recentBookings: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await adminService.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: UsersIcon,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Total Organizers',
      value: stats.totalOrganizers,
      icon: UserGroupIcon,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Total Temples',
      value: stats.totalTemples,
      icon: BuildingLibraryIcon,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: TicketIcon,
      color: 'from-orange-500 to-orange-600',
    },
    {
      title: 'Total Donations',
      value: `₹${stats.totalDonations}`,
      icon: CurrencyRupeeIcon,
      color: 'from-pink-500 to-pink-600',
    },
    {
      title: 'System Health',
      value: 'Excellent',
      icon: ChartBarIcon,
      color: 'from-teal-500 to-teal-600',
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="spinner" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            System overview and management
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Bookings</h2>
            {stats.recentBookings && stats.recentBookings.length === 0 ? (
              <div className="text-center py-8">
                <TicketIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No recent bookings</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentBookings?.slice(0, 5).map((booking) => (
                  <div
                    key={booking._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {booking.userId?.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-600">
                        {booking.templeId?.templeName || 'Temple'}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* System Stats */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">System Statistics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Active Users</span>
                <span className="text-lg font-bold text-blue-600">{stats.totalUsers}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Active Organizers</span>
                <span className="text-lg font-bold text-purple-600">{stats.totalOrganizers}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Listed Temples</span>
                <span className="text-lg font-bold text-green-600">{stats.totalTemples}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Total Bookings</span>
                <span className="text-lg font-bold text-orange-600">{stats.totalBookings}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
