import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  TicketIcon, 
  BuildingLibraryIcon,
  CalendarIcon,
  UserIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import OrganizerLayout from '../../components/layout/OrganizerLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { organizerService } from '../../services/organizerService';

const OrganizerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await organizerService.getBookings();
      setBookings(response.data || []);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    try {
      await organizerService.updateBookingStatus(bookingId, newStatus);
      toast.success(`Booking ${newStatus} successfully`);
      fetchBookings();
    } catch (error) {
      toast.error('Failed to update booking status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const getStats = () => {
    return {
      total: bookings.length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
    };
  };

  const stats = getStats();

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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookings</h1>
          <p className="text-gray-600">Manage darshan bookings for your temples</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600 mb-1">Confirmed</p>
            <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600 mb-1">Completed</p>
            <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600 mb-1">Cancelled</p>
            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex gap-2 overflow-x-auto">
            {['all', 'confirmed', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  filter === status
                    ? 'bg-secondary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </Card>

        {/* Bookings List */}
        <Card className="p-6">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <TicketIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No bookings found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-2 border-gray-200 rounded-xl p-6 hover:border-secondary transition-all"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Booking Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Booking ID</p>
                          <p className="font-bold text-gray-900">{booking.bookingId}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          booking.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <UserIcon className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Devotee</p>
                            <p className="font-medium text-gray-900">{booking.userName}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <PhoneIcon className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="font-medium text-gray-900">{booking.phone}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <BuildingLibraryIcon className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Temple</p>
                            <p className="font-medium text-gray-900">{booking.templeName}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <CalendarIcon className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Date & Time</p>
                            <p className="font-medium text-gray-900">
                              {new Date(booking.darshanDate).toLocaleDateString()} | {booking.startTime}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-6">
                        <div>
                          <p className="text-xs text-gray-500">Quantity</p>
                          <p className="font-semibold text-gray-900">{booking.quantity} person(s)</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Type</p>
                          <p className="font-semibold text-gray-900 capitalize">{booking.ticketType}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Amount</p>
                          <p className="font-semibold text-secondary">₹{booking.totalAmount}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    {booking.status === 'confirmed' && (
                      <div className="flex lg:flex-col gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleStatusUpdate(booking._id, 'completed')}
                          loading={updatingId === booking._id}
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                          Mark Complete
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                          loading={updatingId === booking._id}
                        >
                          <XCircleIcon className="w-4 h-4" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </OrganizerLayout>
  );
};

export default OrganizerBookings;
