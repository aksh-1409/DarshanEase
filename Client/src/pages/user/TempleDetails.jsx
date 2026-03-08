import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  MapPinIcon, 
  ClockIcon,
  CalendarIcon,
  UserGroupIcon,
  CurrencyRupeeIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { userService } from '../../services/userService';

const TempleDetails = () => {
  const { id } = useParams();
  const [temple, setTemple] = useState(null);
  const [darshans, setDarshans] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTempleDetails();
  }, [id]);

  const fetchTempleDetails = async () => {
    try {
      const [templeRes, darshansRes, feedbackRes] = await Promise.all([
        userService.getTempleById(id),
        userService.getDarshans({ templeId: id }),
        userService.getTempleFeedback(id),
      ]);

      setTemple(templeRes.data);
      setDarshans(darshansRes.data || []);
      setFeedback(feedbackRes.data || []);
    } catch (error) {
      toast.error('Failed to load temple details');
    } finally {
      setLoading(false);
    }
  };

  const getAverageRating = () => {
    if (feedback.length === 0) return 0;
    const sum = feedback.reduce((acc, f) => acc + f.rating, 0);
    return (sum / feedback.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  if (!temple) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-12 text-center">
          <p className="text-xl text-gray-600">Temple not found</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96">
        <img
          src={`http://localhost:8000/${temple.templeImage}`}
          alt={temple.templeName}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-5xl font-bold text-white mb-4">{temple.templeName}</h1>
              <div className="flex flex-wrap gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5" />
                  <span>{temple.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5" />
                  <span>{temple.darshanStartTime} - {temple.darshanEndTime}</span>
                </div>
                {feedback.length > 0 && (
                  <div className="flex items-center gap-2">
                    <StarIcon className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span>{getAverageRating()} ({feedback.length} reviews)</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About Temple</h2>
              <p className="text-gray-600 leading-relaxed">{temple.description}</p>
            </Card>

            {/* Available Darshan Slots */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Darshan Slots</h2>

              {darshans.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No darshan slots available at the moment</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {darshans.map((darshan) => (
                    <motion.div
                      key={darshan._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-2 border-gray-200 rounded-xl p-6 hover:border-primary transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {darshan.darshanName}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="w-4 h-4" />
                              {new Date(darshan.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2">
                              <ClockIcon className="w-4 h-4" />
                              {darshan.startTime} - {darshan.endTime}
                            </div>
                            <div className="flex items-center gap-2">
                              <UserGroupIcon className="w-4 h-4" />
                              {darshan.availableSeats} seats available
                            </div>
                          </div>
                          <div className="mt-3 flex gap-4">
                            <div>
                              <span className="text-xs text-gray-500">Normal</span>
                              <p className="text-lg font-bold text-primary">₹{darshan.prices.normal}</p>
                            </div>
                            {darshan.prices.vip > 0 && (
                              <div>
                                <span className="text-xs text-gray-500">VIP</span>
                                <p className="text-lg font-bold text-accent">₹{darshan.prices.vip}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <Link to={`/user/book/${darshan._id}`}>
                          <Button variant="primary">
                            Book Now
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>

            {/* Reviews */}
            {feedback.length > 0 && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
                <div className="space-y-4">
                  {feedback.slice(0, 5).map((review) => (
                    <div key={review._id} className="border-b border-gray-200 pb-4 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{review.userName}</span>
                      </div>
                      <p className="text-gray-600 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Temple Information</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  <p className="font-medium text-gray-900">{temple.location}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Darshan Timings</p>
                  <p className="font-medium text-gray-900">
                    {temple.darshanStartTime} - {temple.darshanEndTime}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Managed By</p>
                  <p className="font-medium text-gray-900">{temple.organizerName}</p>
                </div>

                {temple.facilities && temple.facilities.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Facilities</p>
                    <div className="flex flex-wrap gap-2">
                      {temple.facilities.map((facility, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                        >
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {feedback.length > 0 && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-500 mb-1">Average Rating</p>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-gray-900">{getAverageRating()}</span>
                      <div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`w-5 h-5 ${
                                i < Math.round(getAverageRating())
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">{feedback.length} reviews</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TempleDetails;
