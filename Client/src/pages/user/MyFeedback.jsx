import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  ChatBubbleLeftRightIcon,
  StarIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import UserLayout from '../../components/layout/UserLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';

const MyFeedback = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await userService.getUserBookings(user.id);
      // Filter only completed bookings
      const completedBookings = response.data.filter(b => b.status === 'completed' || b.status === 'confirmed');
      setBookings(completedBookings);
    } catch (error) {
      toast.error('Failed to load bookings');
      console.error('Fetch bookings error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (booking) => {
    setSelectedBooking(booking);
    setRating(0);
    setComment('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
    setRating(0);
    setComment('');
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    setSubmitting(true);
    try {
      await userService.submitFeedback({
        templeId: selectedBooking.templeId._id || selectedBooking.templeId,
        rating,
        comment: comment.trim(),
        bookingId: selectedBooking._id
      });

      toast.success('Feedback submitted successfully!');
      handleCloseModal();
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
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
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <ChatBubbleLeftRightIcon className="w-8 h-8 text-gray-700" />
            <h1 className="text-3xl font-bold text-gray-900">My Feedback</h1>
          </div>
          <p className="text-gray-600">
            Share your darshan experience and help others
          </p>
        </motion.div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <Card className="p-12 text-center">
            <ChatBubbleLeftRightIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Bookings Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Complete a darshan booking to leave feedback
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      {/* Temple Image */}
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={`http://localhost:8000/${booking.templeImage}`}
                          alt={booking.templeName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=200';
                          }}
                        />
                      </div>

                      {/* Booking Details */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {booking.templeName}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>Darshan: {booking.darshanName}</p>
                          <p>Date: {new Date(booking.darshanDate).toLocaleDateString()}</p>
                          <p>Time: {booking.startTime} - {booking.endTime}</p>
                          <p>Booking ID: {booking._id.slice(-8).toUpperCase()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Feedback Button */}
                    <Button
                      onClick={() => handleOpenModal(booking)}
                      variant="primary"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <PlusIcon className="w-4 h-4" />
                      Leave Feedback
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      <Modal isOpen={showModal} onClose={handleCloseModal} title="Leave Feedback">
        <form onSubmit={handleSubmitFeedback} className="space-y-6">
          {/* Temple Info */}
          {selectedBooking && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-1">
                {selectedBooking.templeName}
              </h4>
              <p className="text-sm text-gray-600">
                {selectedBooking.darshanName} • {new Date(selectedBooking.darshanDate).toLocaleDateString()}
              </p>
            </div>
          )}

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Rate your experience
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  {star <= (hoverRating || rating) ? (
                    <StarIconSolid className="w-10 h-10 text-yellow-400" />
                  ) : (
                    <StarIcon className="w-10 h-10 text-gray-300" />
                  )}
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {rating} {rating === 1 ? 'star' : 'stars'}
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your feedback
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Share your experience about the darshan, temple facilities, staff behavior, etc."
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Your feedback will be reviewed before being published
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              disabled={submitting || rating === 0 || !comment.trim()}
            >
              Submit Feedback
            </Button>
          </div>
        </form>
      </Modal>
    </UserLayout>
  );
};

export default MyFeedback;
