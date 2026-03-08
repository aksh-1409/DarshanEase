import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  BuildingLibraryIcon, 
  MapPinIcon, 
  ClockIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import OrganizerLayout from '../../components/layout/OrganizerLayout';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { organizerService } from '../../services/organizerService';

const EditTemple = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    templeName: '',
    location: '',
    description: '',
    darshanStartTime: '',
    darshanEndTime: '',
    facilities: '',
    templeImage: null,
  });

  useEffect(() => {
    fetchTemple();
  }, [id]);

  const fetchTemple = async () => {
    try {
      const temples = await organizerService.getMyTemples();
      const temple = temples.data.find(t => t._id === id);
      
      if (!temple) {
        toast.error('Temple not found');
        navigate('/organizer/temples');
        return;
      }

      setFormData({
        templeName: temple.templeName,
        location: temple.location,
        description: temple.description,
        darshanStartTime: temple.darshanStartTime,
        darshanEndTime: temple.darshanEndTime,
        facilities: temple.facilities || '',
        templeImage: null,
      });

      if (temple.templeImage) {
        setImagePreview(`http://localhost:8000/${temple.templeImage}`);
      }
    } catch (error) {
      toast.error('Failed to load temple');
      navigate('/organizer/temples');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setFormData({ ...formData, templeImage: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('templeName', formData.templeName);
      data.append('location', formData.location);
      data.append('description', formData.description);
      data.append('darshanStartTime', formData.darshanStartTime);
      data.append('darshanEndTime', formData.darshanEndTime);
      data.append('facilities', formData.facilities);
      
      if (formData.templeImage) {
        data.append('templeImage', formData.templeImage);
      }

      await organizerService.updateTemple(id, data);
      toast.success('Temple updated successfully!');
      navigate('/organizer/temples');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update temple');
    } finally {
      setSubmitting(false);
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
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Temple</h1>
          <p className="text-gray-600">Update temple information</p>
        </motion.div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Temple Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temple Image
              </label>
              <div className="relative">
                {imagePreview ? (
                  <div className="relative w-full h-64 rounded-xl overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData({ ...formData, templeImage: null });
                      }}
                      className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary transition-colors bg-gray-50">
                    <PhotoIcon className="w-16 h-16 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-2">Click to upload new image</p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Temple Name */}
            <Input
              label="Temple Name"
              type="text"
              name="templeName"
              value={formData.templeName}
              onChange={handleChange}
              placeholder="Enter temple name"
              icon={BuildingLibraryIcon}
              required
            />

            {/* Location */}
            <Input
              label="Location"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter temple location"
              icon={MapPinIcon}
              required
            />

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter temple description, history, and significance"
                rows="4"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-secondary transition-all"
              />
            </div>

            {/* Darshan Timings */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Darshan Start Time"
                type="time"
                name="darshanStartTime"
                value={formData.darshanStartTime}
                onChange={handleChange}
                icon={ClockIcon}
                required
              />

              <Input
                label="Darshan End Time"
                type="time"
                name="darshanEndTime"
                value={formData.darshanEndTime}
                onChange={handleChange}
                icon={ClockIcon}
                required
              />
            </div>

            {/* Facilities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facilities (Optional)
              </label>
              <input
                type="text"
                name="facilities"
                value={formData.facilities}
                onChange={handleChange}
                placeholder="e.g., Parking, Prasad Counter, Wheelchair Access (comma separated)"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-secondary transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate multiple facilities with commas
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/organizer/temples')}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="secondary"
                fullWidth
                loading={submitting}
              >
                Update Temple
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </OrganizerLayout>
  );
};

export default EditTemple;
