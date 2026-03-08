import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  ChatBubbleLeftRightIcon, 
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { adminService } from '../../services/adminService';

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await adminService.getAllFeedback();
      setFeedbacks(response.data || []);
    } catch (error) {
      toast.error('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (feedbackId) => {
    setUpdatingId(feedbackId);
    try {
      await adminService.updateFeedbackStatus(feedbackId, true);
      toast.success('Feedback approved');
      fetchFeedbacks();
    } catch (error) {
      toast.error('Failed to approve feedback');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleReject = async (feedbackId) => {
    setUpdatingId(feedbackId);
    try {
      await adminService.updateFeedbackStatus(feedbackId, false);
      toast.success('Feedback rejected');
      fetchFeedbacks();
    } catch (error) {
      toast.error('Failed to reject feedback');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (feedbackId) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) {
      return;
    }

    setDeletingId(feedbackId);
    try {
      await adminService.deleteFeedback(feedbackId);
      toast.success('Feedback deleted');
      fetchFeedbacks();
    } catch (error) {
      toast.error('Failed to delete feedback');
    } finally {
      setDeletingId(null);
    }
  };

  const getFilteredFeedbacks = () => {
    if (filterStatus === 'all') return feedbacks;
    if (filterStatus === 'approved') return feedbacks.filter(f => f.isApproved === true);
    if (filterStatus === 'pending') return feedbacks.filter(f => f.isApproved === null || f.isApproved === undefined);
    if (filterStatus === 'rejected') return feedbacks.filter(f => f.isApproved === false);
    return feedbacks;
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? (
            <StarIconSolid key={star} className="w-5 h-5 text-yellow-400" />
          ) : (
            <StarIcon key={star} className="w-5 h-5 text-gray-300" />
          )
        ))}
      </div>
    );
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

  const filteredFeedbacks = getFilteredFeedbacks();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Feedback Management</h1>
            <p className="text-gray-600">Review and manage user feedback</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
            <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-900">{feedbacks.length} Feedbacks</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total</p>
                <p className="text-3xl font-bold text-gray-900">{feedbacks.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Approved</p>
                <p className="text-3xl font-bold text-green-600">
                  {feedbacks.filter(f => f.isApproved === true).length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {feedbacks.filter(f => f.isApproved === null || f.isApproved === undefined).length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Rejected</p>
                <p className="text-3xl font-bold text-red-600">
                  {feedbacks.filter(f => f.isApproved === false).length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filter */}
        <Card className="p-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 transition-all"
          >
            <option value="all">All Feedback</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </Card>

        {/* Feedbacks List */}
        {filteredFeedbacks.length === 0 ? (
          <Card className="p-12 text-center">
            <ChatBubbleLeftRightIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No feedback found</h3>
            <p className="text-gray-600">No feedback matches your filter criteria</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredFeedbacks.map((feedback) => (
              <motion.div
                key={feedback._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{feedback.userName}</h3>
                        {renderStars(feedback.rating)}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{feedback.templeName}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(feedback.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div>
                      {feedback.isApproved === true && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          Approved
                        </span>
                      )}
                      {feedback.isApproved === false && (
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                          Rejected
                        </span>
                      )}
                      {(feedback.isApproved === null || feedback.isApproved === undefined) && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{feedback.comment}</p>

                  <div className="flex gap-2">
                    {feedback.isApproved !== true && (
                      <button
                        onClick={() => handleApprove(feedback._id)}
                        disabled={updatingId === feedback._id}
                        className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        <CheckCircleIcon className="w-5 h-5" />
                        Approve
                      </button>
                    )}
                    {feedback.isApproved !== false && (
                      <button
                        onClick={() => handleReject(feedback._id)}
                        disabled={updatingId === feedback._id}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        <XCircleIcon className="w-5 h-5" />
                        Reject
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(feedback._id)}
                      disabled={deletingId === feedback._id}
                      className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <TrashIcon className="w-5 h-5" />
                      Delete
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default FeedbackManagement;
