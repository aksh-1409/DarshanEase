import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  CalendarDaysIcon, 
  ClockIcon,
  PhotoIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline';
import OrganizerLayout from '../../components/layout/OrganizerLayout';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { organizerService } from '../../services/organizerService';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [temples, setTemples] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    eventName: '',
    templeId: '',
    eventDate: '',
    eventTime: '',
    description: '',
    eventImage: null,
  });

  useEffect(() => {
    fetchTemples();
  }, []);

  const fetchTemples = async () => {
    try {
      const response = await organizerService.getMyTemples();
      setTemples(response.data || []);
    } catch (error) {
      toast.error('Failed to load temples');
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
      setFormData({ ...formData, eventImage: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.eventImage) {
      toast.error('Please upload an event image');
      return;
    }

    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('eventName', formData.eventName);
      data.append('templeId', formData.templeId);
      data.append('eventDate', formData.eventDate);
      data.append('eventTime', formData.eventTime);
      data.append('description', formData.description);
      data.append('eventImage', formData.eventImage);

      await organizerService.createEvent(data);
      toast.success('Event created successfully!');
      navigate('/organizer/events');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create event');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <OrganizerLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Event</h1>
          <p className="text-gray-600">Add a new temple event or festival</p>
        </motion.div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Image <span className="text-red-500">*</span>
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
                        setFormData({ ...formData, eventImage: null });
                      }}
                      className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary transition-colors bg-gray-50">
                    <PhotoIcon className="w-16 h-16 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-2">Click to upload event image</p>
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

            {/* Event Name */}
            <Input
              label="Event Name"
              type="text"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
              placeholder="e.g., Maha Shivaratri, Diwali Celebration"
              icon={CalendarDaysIcon}
              required
            />

            {/* Temple Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Temple <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <BuildingLibraryIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  name="templeId"
                  value={formData.templeId}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-secondary transition-all appearance-none"
                >
                  <option value="">Choose a temple</option>
                  {temples.map((temple) => (
                    <option key={temple._id} value={temple._id}>
                      {temple.templeName} - {temple.location}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Event Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Event Date"
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                icon={CalendarDaysIcon}
                required
                min={new Date().toISOString().split('T')[0]}
              />

              <Input
                label="Event Time"
                type="time"
                name="eventTime"
                value={formData.eventTime}
                onChange={handleChange}
                icon={ClockIcon}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the event, rituals, and special arrangements"
                rows="4"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-secondary transition-all"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/organizer/events')}
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
                Create Event
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </OrganizerLayout>
  );
};

export default CreateEvent;
