import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  BuildingLibraryIcon, 
  MapPinIcon, 
  ClockIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import OrganizerLayout from '../../components/layout/OrganizerLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { organizerService } from '../../services/organizerService';

const MyTemples = () => {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchTemples();
  }, []);

  const fetchTemples = async () => {
    try {
      const response = await organizerService.getMyTemples();
      setTemples(response.data || []);
    } catch (error) {
      toast.error('Failed to load temples');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (templeId) => {
    if (!window.confirm('Are you sure you want to delete this temple? This action cannot be undone.')) {
      return;
    }

    setDeletingId(templeId);
    try {
      await organizerService.deleteTemple(templeId);
      toast.success('Temple deleted successfully');
      fetchTemples();
    } catch (error) {
      toast.error('Failed to delete temple');
    } finally {
      setDeletingId(null);
    }
  };

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Temples</h1>
            <p className="text-gray-600">Manage your registered temples</p>
          </div>
          <Link to="/organizer/temple/create">
            <Button variant="secondary">
              <PlusIcon className="w-5 h-5" />
              Add Temple
            </Button>
          </Link>
        </div>

        {temples.length === 0 ? (
          <Card className="p-12 text-center">
            <BuildingLibraryIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No temples yet</h3>
            <p className="text-gray-600 mb-6">Register your first temple to start managing darshan bookings</p>
            <Link to="/organizer/temple/create">
              <Button variant="secondary">
                <PlusIcon className="w-5 h-5" />
                Register Temple
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {temples.map((temple, index) => (
              <motion.div
                key={temple._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
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
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        temple.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                      }`}>
                        {temple.isActive ? 'Active' : 'Inactive'}
                      </span>
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

                    <div className="flex gap-2 pt-2">
                      <Link to={`/organizer/temple/edit/${temple._id}`} className="flex-1">
                        <Button variant="outline" size="sm" fullWidth>
                          <PencilIcon className="w-4 h-4" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(temple._id)}
                        loading={deletingId === temple._id}
                      >
                        <TrashIcon className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </OrganizerLayout>
  );
};

export default MyTemples;
