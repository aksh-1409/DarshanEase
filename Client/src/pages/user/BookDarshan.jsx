import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  BuildingLibraryIcon, 
  CalendarIcon, 
  ClockIcon,
  UserGroupIcon,
  CurrencyRupeeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import UserLayout from '../../components/layout/UserLayout';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';

const BookDarshan = () => {
  const { darshanId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [darshan, setDarshan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    quantity: 1,
    ticketType: 'normal',
    phone: '',
  });

  useEffect(() => {
    fetchDarshanDetails();
  }, [darshanId]);

  const fetchDarshanDetails = async () => {
    try {
      const response = await userService.getDarshanById(darshanId);
      setDarshan(response.data);
    } catch (error) {
      toast.error('Failed to load darshan details');
      navigate('/temples');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const calculateTotal = () => {
    if (!darshan) return 0;
    const price = formData.ticketType === 'vip' ? darshan.prices.vip : darshan.prices.normal;
    return price * formData.quantity;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.quantity > darshan.availableSeats) {
      toast.error(`Only ${darshan.availableSeats} seats available`);
      return;
    }

    if (!formData.phone) {
      toast.error('Phone number is required');
      return;
    }

    setSubmitting(true);

    try {
      const bookingData = {
        darshanId: darshan._id,
        quantity: parseInt(formData.quantity),
        ticketType: formData.ticketType,
        phone: formData.phone,
      };

      await userService.createBooking(bookingData);
      toast.success('Booking confirmed successfully!');
      navigate('/user/bookings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
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

  if (!darshan) {
    return (
      <UserLayout>
        <Card className="p-12 text-center">
          <p className="text-xl text-gray-600">Darshan not found</p>
        </Card>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Darshan</h1>
          <p className="text-gray-600">Complete your booking details</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Booking Details</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Darshan Info */}
                <div className="bg-gradient-to-r from-primary to-accent text-white p-6 rounded-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BuildingLibraryIcon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-1">{darshan.templeName}</h3>
                      <p className="text-white/90 mb-3">{darshan.darshanName}</p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4" />
                          {new Date(darshan.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <ClockIcon className="w-4 h-4" />
                          {darshan.startTime} - {darshan.endTime}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ticket Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Ticket Type
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, ticketType: 'normal' })}
                      className={`p-4 border-2 rounded-xl transition-all ${
                        formData.ticketType === 'normal'
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-semibold text-gray-900">Normal</p>
                      <p className="text-2xl font-bold text-primary">₹{darshan.prices.normal}</p>
                      <p className="text-sm text-gray-600">per person</p>
                    </button>

                    {darshan.prices.vip > 0 && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, ticketType: 'vip' })}
                        className={`p-4 border-2 rounded-xl transition-all ${
                          formData.ticketType === 'vip'
                            ? 'border-accent bg-accent/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className="font-semibold text-gray-900">VIP</p>
                        <p className="text-2xl font-bold text-accent">₹{darshan.prices.vip}</p>
                        <p className="text-sm text-gray-600">per person</p>
                      </button>
                    )}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of People
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, quantity: Math.max(1, formData.quantity - 1) })}
                      className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-xl transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      min="1"
                      max={darshan.availableSeats}
                      className="w-24 text-center text-2xl font-bold border-2 border-gray-200 rounded-lg py-2"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, quantity: Math.min(darshan.availableSeats, formData.quantity + 1) })}
                      className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-xl transition-colors"
                    >
                      +
                    </button>
                    <span className="text-sm text-gray-600">
                      ({darshan.availableSeats} seats available)
                    </span>
                  </div>
                </div>

                {/* Phone Number */}
                <Input
                  label="Contact Phone Number"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  icon={PhoneIcon}
                  required
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={submitting}
                  size="lg"
                >
                  Confirm Booking - ₹{calculateTotal()}
                </Button>
              </form>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Summary</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <BuildingLibraryIcon className="w-5 h-5" />
                  <div>
                    <p className="text-xs text-gray-500">Temple</p>
                    <p className="font-medium text-gray-900">{darshan.templeName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <CalendarIcon className="w-5 h-5" />
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(darshan.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <ClockIcon className="w-5 h-5" />
                  <div>
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="font-medium text-gray-900">
                      {darshan.startTime} - {darshan.endTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <UserGroupIcon className="w-5 h-5" />
                  <div>
                    <p className="text-xs text-gray-500">People</p>
                    <p className="font-medium text-gray-900">{formData.quantity}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <CurrencyRupeeIcon className="w-5 h-5" />
                    <div>
                      <p className="text-xs text-gray-500">Ticket Type</p>
                      <p className="font-medium text-gray-900 capitalize">{formData.ticketType}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="text-3xl font-bold text-primary">₹{calculateTotal()}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default BookDarshan;
