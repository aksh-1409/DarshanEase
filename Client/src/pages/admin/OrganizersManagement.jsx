import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  UserGroupIcon, 
  CheckCircleIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { adminService } from '../../services/adminService';

const OrganizersManagement = () => {
  const [organizers, setOrganizers] = useState([]);
  const [filteredOrganizers, setFilteredOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [actioningId, setActioningId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    isActive: true,
    isApproved: false,
  });

  useEffect(() => {
    fetchOrganizers();
  }, []);

  useEffect(() => {
    let filtered = organizers;

    if (searchTerm) {
      filtered = filtered.filter(org =>
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filter !== 'all') {
      if (filter === 'approved') {
        filtered = filtered.filter(org => org.isApproved);
      } else if (filter === 'pending') {
        filtered = filtered.filter(org => !org.isApproved);
      }
    }

    setFilteredOrganizers(filtered);
  }, [searchTerm, filter, organizers]);

  const fetchOrganizers = async () => {
    try {
      const response = await adminService.getAllOrganizers();
      setOrganizers(response.data || []);
      setFilteredOrganizers(response.data || []);
    } catch (error) {
      toast.error('Failed to load organizers');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (organizerId) => {
    setActioningId(organizerId);
    try {
      await adminService.approveOrganizer(organizerId);
      toast.success('Organizer approved successfully');
      fetchOrganizers();
    } catch (error) {
      toast.error('Failed to approve organizer');
    } finally {
      setActioningId(null);
    }
  };

  const handleEdit = (organizer) => {
    setSelectedOrganizer(organizer);
    setFormData({
      name: organizer.name,
      email: organizer.email,
      phone: organizer.phone || '',
      isActive: organizer.isActive,
      isApproved: organizer.isApproved,
    });
    setShowEditModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await adminService.updateOrganizer(selectedOrganizer._id, formData);
      toast.success('Organizer updated successfully');
      setShowEditModal(false);
      fetchOrganizers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update organizer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (organizerId) => {
    if (!window.confirm('Are you sure you want to delete this organizer? This action cannot be undone.')) {
      return;
    }

    setActioningId(organizerId);
    try {
      await adminService.deleteOrganizer(organizerId);
      toast.success('Organizer deleted successfully');
      fetchOrganizers();
    } catch (error) {
      toast.error('Failed to delete organizer');
    } finally {
      setActioningId(null);
    }
  };

  const getStats = () => {
    return {
      total: organizers.length,
      approved: organizers.filter(o => o.isApproved).length,
      pending: organizers.filter(o => !o.isApproved).length,
    };
  };

  const stats = getStats();

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
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Organizers Management</h1>
          <p className="text-gray-600">Manage temple organizers and approvals</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4">
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600 mb-1">Approved</p>
            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600 mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </Card>
        </div>

        {/* Search & Filter */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search organizers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 transition-all"
              />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex gap-2">
              {['all', 'approved', 'pending'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    filter === f
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Organizers Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organizer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrganizers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      No organizers found
                    </td>
                  </tr>
                ) : (
                  filteredOrganizers.map((organizer) => (
                    <motion.tr
                      key={organizer._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-semibold text-gray-900">{organizer.name}</p>
                          <p className="text-sm text-gray-500">{organizer.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900">{organizer.phone || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            organizer.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {organizer.isApproved ? 'Approved' : 'Pending'}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            organizer.isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {organizer.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(organizer.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          {!organizer.isApproved && (
                            <button
                              onClick={() => handleApprove(organizer._id)}
                              disabled={actioningId === organizer._id}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Approve"
                            >
                              <CheckCircleIcon className="w-5 h-5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleEdit(organizer)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(organizer._id)}
                            disabled={actioningId === organizer._id}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Organizer"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input
            label="Phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isApproved"
                checked={formData.isApproved}
                onChange={handleChange}
                className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label className="text-sm font-medium text-gray-700">
                Approved
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label className="text-sm font-medium text-gray-700">
                Active Account
              </label>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={submitting}
          >
            Update Organizer
          </Button>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default OrganizersManagement;
