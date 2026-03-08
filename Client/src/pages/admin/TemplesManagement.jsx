import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  BuildingLibraryIcon, 
  TrashIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import { adminService } from '../../services/adminService';

const TemplesManagement = () => {
  const [temples, setTemples] = useState([]);
  const [filteredTemples, setFilteredTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [selectedTemple, setSelectedTemple] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

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
      const response = await adminService.getAllTemples();
      setTemples(response.data || []);
      setFilteredTemples(response.data || []);
    } catch (error) {
      toast.error('Failed to load temples');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (templeId) => {
    if (!window.confirm('Are you sure you want to delete this temple? This will also delete all associated darshans and bookings.')) {
      return;
    }

    setDeletingId(templeId);
    try {
      await adminService.deleteTemple(templeId);
      toast.success('Temple deleted successfully');
      fetchTemples();
    } catch (error) {
      toast.error('Failed to delete temple');
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewDetails = (temple) => {
    setSelectedTemple(temple);
    setShowDetailsModal(true);
  };

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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Temples Management</h1>
            <p className="text-gray-600">View and manage all temples</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
            <BuildingLibraryIcon className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-900">{temples.length} Temples</span>
          </div>
        </div>

        {/* Search */}
        <Card className="p-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search temples by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 transition-all"
            />
          </div>
        </Card>

        {/* Temples Grid */}
        {filteredTemples.length === 0 ? (
          <Card className="p-12 text-center">
            <BuildingLibraryIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No temples found</h3>
            <p className="text-gray-600">No temples match your search criteria</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemples.map((temple) => (
              <motion.div
                key={temple._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                  {temple.templeImage && (
                    <img
                      src={`http://localhost:8000/${temple.templeImage}`}
                      alt={temple.templeName}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {temple.templeName}
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPinIcon className="w-4 h-4" />
                        {temple.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <ClockIcon className="w-4 h-4" />
                        {temple.darshanStartTime} - {temple.darshanEndTime}
                      </div>
                      <div className="text-sm text-gray-600">
                        Organizer: <span className="font-semibold">{temple.organizerName}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(temple)}
                        className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleDelete(temple._id)}
                        disabled={deletingId === temple._id}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Temple Details"
        size="lg"
      >
        {selectedTemple && (
          <div className="space-y-4">
            {selectedTemple.templeImage && (
              <img
                src={`http://localhost:8000/${selectedTemple.templeImage}`}
                alt={selectedTemple.templeName}
                className="w-full h-64 object-cover rounded-lg"
              />
            )}
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedTemple.templeName}
              </h3>
              <p className="text-gray-600 mb-4">{selectedTemple.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-semibold text-gray-900">{selectedTemple.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Organizer</p>
                <p className="font-semibold text-gray-900">{selectedTemple.organizerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Darshan Timings</p>
                <p className="font-semibold text-gray-900">
                  {selectedTemple.darshanStartTime} - {selectedTemple.darshanEndTime}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Created On</p>
                <p className="font-semibold text-gray-900">
                  {new Date(selectedTemple.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {selectedTemple.facilities && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Facilities</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTemple.facilities.split(',').map((facility, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {facility.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default TemplesManagement;
