import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  HeartIcon, 
  BuildingLibraryIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import UserLayout from '../../components/layout/UserLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';

const MyDonations = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    templeId: '',
    amount: '',
    purpose: '',
    phone: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [donationsRes, templesRes] = await Promise.all([
        userService.getUserDonations(user.id),
        userService.getTemples(),
      ]);
      setDonations(donationsRes.data || []);
      setTemples(templesRes.data || []);
    } catch (error) {
      toast.error('Failed to load donations');
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
      await userService.makeDonation({
        ...formData,
        amount: parseFloat(formData.amount),
      });
      toast.success('Donation successful! Thank you for your contribution.');
      setShowDonateModal(false);
      setFormData({ templeId: '', amount: '', purpose: '', phone: '' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Donation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const getTotalDonations = () => {
    return donations.reduce((sum, d) => sum + d.amount, 0);
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Donations</h1>
            <p className="text-gray-600">Your contributions to temples</p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowDonateModal(true)}
          >
            <PlusIcon className="w-5 h-5" />
            Make Donation
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Donations</p>
                <p className="text-3xl font-bold text-gray-900">{donations.length}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
                <HeartIcon className="w-7 h-7 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <p className="text-3xl font-bold text-gray-900">₹{getTotalDonations()}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <CurrencyRupeeIcon className="w-7 h-7 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Temples Supported</p>
                <p className="text-3xl font-bold text-gray-900">
                  {new Set(donations.map(d => d.templeId)).size}
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <BuildingLibraryIcon className="w-7 h-7 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Donations List */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Donation History</h2>

          {donations.length === 0 ? (
            <div className="text-center py-12">
              <HeartIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No donations yet</h3>
              <p className="text-gray-600 mb-6">Make your first donation to support temples</p>
              <Button variant="primary" onClick={() => setShowDonateModal(true)}>
                Make Donation
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {donations.map((donation) => (
                <motion.div
                  key={donation._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                      <HeartIcon className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{donation.templeName}</p>
                      {donation.purpose && (
                        <p className="text-sm text-gray-600">{donation.purpose}</p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <CalendarIcon className="w-3 h-3" />
                        {new Date(donation.donationDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-pink-600">₹{donation.amount}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      donation.paymentStatus === 'completed' ? 'bg-green-100 text-green-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {donation.paymentStatus}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Donate Modal */}
      <Modal
        isOpen={showDonateModal}
        onClose={() => setShowDonateModal(false)}
        title="Make a Donation"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Temple
            </label>
            <select
              name="templeId"
              value={formData.templeId}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-all"
            >
              <option value="">Choose a temple</option>
              {temples.map((temple) => (
                <option key={temple._id} value={temple._id}>
                  {temple.templeName} - {temple.location}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Donation Amount"
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter amount"
            icon={CurrencyRupeeIcon}
            required
            min="1"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purpose (Optional)
            </label>
            <textarea
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="e.g., Temple maintenance, Festival celebration"
              rows="3"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-all"
            />
          </div>

          <Input
            label="Phone Number"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            required
          />

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              💡 Your donation will help in temple maintenance and development activities.
            </p>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={submitting}
          >
            Donate ₹{formData.amount || '0'}
          </Button>
        </form>
      </Modal>
    </UserLayout>
  );
};

export default MyDonations;
