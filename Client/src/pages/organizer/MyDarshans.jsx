import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  CalendarIcon, 
  ClockIcon,
  UserGroupIcon,
  CurrencyRupeeIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import OrganizerLayout from '../../components/layout/OrganizerLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { organizerService } from '../../services/organizerService';

const MyDarshans = () => {
  const [darshans, setDarshans] = useState([]);
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({
    darshanName: '',
    templeId: '',
    date: '',
    startTime: '',
    endTime: '',
    description: '',
    totalSeats: '',
    normalPrice: '',
    vipPrice: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [darshansRes, templesRes] = await Promise.all([
        organizerService.getMyDarshans(),
        organizerService.getMyTemples(),
      ]);
      setDarshans(darshansRes.data || []);
      setTemples(templesRes.data || []);
    } catch (error) {
      toast.error('Failed to load darshans');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await organizerService.createDarshan({
        ...formData,
        totalSeats: parseInt(formData.totalSeats),
        normalPrice: parseFloat(formData.normalPrice),
        vipPrice: parseFloat(formData.vipPrice || 0),
      });
      toast.success('Darshan slot created successfully!');
      setShowCreateModal(false);
      setFormData({
        darshanName: '',
        templeId: '',
        date: '',
        startTime: '',
        endTime: '',
        description: '',
        totalSeats: '',
        normalPrice: '',
        vipPrice: '',
      });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create darshan');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (darshanId) => {
    if (!window.confirm('Are you sure you want to delete this darshan slot?')) {
      return;
    }

    setDeletingId(darshanId);
    try {
      await organizerService.deleteDarshan(darshanId);
      toast.success('Darshan deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete darshan');
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Darshan Slots</h1>
            <p className="text-gray-600">Manage your temple darshan schedules</p>
          </div>
          <Button
            variant="secondary"
            onClick={() => setShowCreateModal(true)}
            disabled={temples.length === 0}
          >
            <PlusIcon className="w-5 h-5" />
            Add Darshan Slot
          </Button>
        </div>

        {temples.length === 0 ? (
          <Card className="p-12 text-center">
            <CalendarIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No temples registered</h3>
            <p className="text-gray-600 mb-6">Please register a temple first to create darshan slots</p>
            <Link to="/organizer/temple/create">
              <Button variant="secondary">Register Temple</Button>
            </Link>
          </Card>
        ) : darshans.length === 0 ? (
          <Card className="p-12 text-center">
            <CalendarIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No darshan slots yet</h3>
            <p className="text-gray-600 mb-6">Create your first darshan slot to start accepting bookings</p>
            <Button variant="secondary" onClick={() => setShowCreateModal(true)}>
              <PlusIcon className="w-5 h-5" />
              Create Darshan Slot
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {darshans.map((darshan) => (
              <motion.div
                key={darshan._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {darshan.darshanName}
                          </h3>
                          <p className="text-gray-600">{darshan.templeName}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          darshan.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {darshan.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Date</p>
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                            <p className="font-semibold text-gray-900">
                              {new Date(darshan.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Time</p>
                          <div className="flex items-center gap-2">
                            <ClockIcon className="w-4 h-4 text-gray-400" />
                            <p className="font-semibold text-gray-900">
                              {darshan.startTime} - {darshan.endTime}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Available Seats</p>
                          <div className="flex items-center gap-2">
                            <UserGroupIcon className="w-4 h-4 text-gray-400" />
                            <p className="font-semibold text-gray-900">
                              {darshan.availableSeats} / {darshan.totalSeats}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Pricing</p>
                          <div className="flex items-center gap-2">
                            <CurrencyRupeeIcon className="w-4 h-4 text-gray-400" />
                            <p className="font-semibold text-gray-900">
                              ₹{darshan.prices.normal}
                              {darshan.prices.vip > 0 && ` / ₹${darshan.prices.vip}`}
                            </p>
                          </div>
                        </div>
                      </div>

                      {darshan.description && (
                        <p className="text-sm text-gray-600 mt-4">{darshan.description}</p>
                      )}
                    </div>

                    <div className="flex md:flex-col gap-2">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(darshan._id)}
                        loading={deletingId === darshan._id}
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

      {/* Create Darshan Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Darshan Slot"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Temple <span className="text-red-500">*</span>
            </label>
            <select
              name="templeId"
              value={formData.templeId}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-secondary transition-all"
            >
              <option value="">Choose a temple</option>
              {temples.map((temple) => (
                <option key={temple._id} value={temple._id}>
                  {temple.templeName}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Darshan Name"
            type="text"
            name="darshanName"
            value={formData.darshanName}
            onChange={handleChange}
            placeholder="e.g., Morning Aarti, Evening Darshan"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
            <Input
              label="Total Seats"
              type="number"
              name="totalSeats"
              value={formData.totalSeats}
              onChange={handleChange}
              placeholder="100"
              required
              min="1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Time"
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
            <Input
              label="End Time"
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Normal Price"
              type="number"
              name="normalPrice"
              value={formData.normalPrice}
              onChange={handleChange}
              placeholder="0"
              required
              min="0"
            />
            <Input
              label="VIP Price (Optional)"
              type="number"
              name="vipPrice"
              value={formData.vipPrice}
              onChange={handleChange}
              placeholder="0"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Special instructions or details about this darshan"
              rows="3"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-secondary transition-all"
            />
          </div>

          <Button
            type="submit"
            variant="secondary"
            fullWidth
            loading={submitting}
          >
            Create Darshan Slot
          </Button>
        </form>
      </Modal>
    </OrganizerLayout>
  );
};

export default MyDarshans;
