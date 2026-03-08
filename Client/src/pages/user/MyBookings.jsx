import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  TicketIcon, 
  BuildingLibraryIcon, 
  CalendarIcon,
  ClockIcon,
  XMarkIcon,
  QrCodeIcon
} from '@heroicons/react/24/outline';
import UserLayout from '../../components/layout/UserLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await userService.getUserBookings(user.id);
      setBookings(response.data || []);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setCancellingId(bookingId);
    try {
      await userService.cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  const handleViewTicket = (booking) => {
    setSelectedBooking(booking);
    setShowTicketModal(true);
  };

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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">View and manage your darshan bookings</p>
        </div>

        {bookings.length === 0 ? (
          <Card className="p-12 text-center">
            <TicketIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-6">Start your spiritual journey by booking a darshan</p>
            <Button variant="primary" onClick={() => window.location.href = '/temples'}>
              Browse Temples
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Temple Image */}
                    <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={`http://localhost:8000/${booking.templeImage}`}
                        alt={booking.templeName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400';
                        }}
                      />
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {booking.templeName}
                          </h3>
                          <p className="text-gray-600">{booking.darshanName}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          booking.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Booking ID</p>
                          <p className="font-semibold text-gray-900">{booking.bookingId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Date</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(booking.darshanDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Time</p>
                          <p className="font-semibold text-gray-900">
                            {booking.startTime} - {booking.endTime}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Quantity</p>
                          <p className="font-semibold text-gray-900">{booking.quantity} person(s)</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Total Amount</p>
                          <p className="text-2xl font-bold text-primary">₹{booking.totalAmount}</p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewTicket(booking)}
                          >
                            <QrCodeIcon className="w-4 h-4" />
                            View Ticket
                          </Button>
                          {booking.status === 'confirmed' && (
                            <Button
                              variant="danger"
                              size="sm"
                              loading={cancellingId === booking._id}
                              onClick={() => handleCancelBooking(booking._id)}
                            >
                              <XMarkIcon className="w-4 h-4" />
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Ticket Modal */}
      <Modal
        isOpen={showTicketModal}
        onClose={() => setShowTicketModal(false)}
        title="E-Ticket"
        size="md"
      >
        {selectedBooking && (
          <div className="space-y-6">
            <div 
              className="text-white p-6 rounded-xl"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              <h3 className="text-2xl font-bold mb-2">{selectedBooking.templeName}</h3>
              <p className="opacity-90">{selectedBooking.darshanName}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Booking ID</p>
                <p className="font-semibold text-gray-900">{selectedBooking.bookingId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <p className="font-semibold text-gray-900">{selectedBooking.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date(selectedBooking.darshanDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Time</p>
                <p className="font-semibold text-gray-900">
                  {selectedBooking.startTime} - {selectedBooking.endTime}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Quantity</p>
                <p className="font-semibold text-gray-900">{selectedBooking.quantity} person(s)</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Amount</p>
                <p className="font-semibold" style={{ color: '#667eea' }}>₹{selectedBooking.totalAmount}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <QrCodeIcon className="w-32 h-32 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">QR Code for entry verification</p>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Please show this ticket at the temple entrance
            </p>
          </div>
        )}
      </Modal>
    </UserLayout>
  );
};

export default MyBookings;
