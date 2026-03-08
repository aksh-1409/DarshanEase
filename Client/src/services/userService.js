import api from './api';

export const userService = {
  // Profile
  getProfile: async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await api.get(`/user/profile/${user.id}`);
    return response.data;
  },

  updateProfile: async (profileData) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await api.put(`/user/profile/${user.id}`, profileData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.put('/user/change-password', passwordData);
    return response.data;
  },

  // Temples
  getTemples: async () => {
    const response = await api.get('/organizer/temples');
    return response.data;
  },

  getTempleById: async (id) => {
    const response = await api.get(`/organizer/temple/${id}`);
    return response.data;
  },

  // Darshans
  getDarshans: async (params) => {
    const response = await api.get('/organizer/darshans', { params });
    return response.data;
  },

  getDarshanById: async (id) => {
    const response = await api.get(`/user/darshan/${id}`);
    return response.data;
  },

  // Bookings
  createBooking: async (bookingData) => {
    const response = await api.post('/user/booking', bookingData);
    return response.data;
  },

  getUserBookings: async (userId) => {
    const response = await api.get(`/user/bookings/${userId}`);
    return response.data;
  },

  cancelBooking: async (bookingId) => {
    const response = await api.delete(`/user/booking/${bookingId}`);
    return response.data;
  },

  // Feedback
  submitFeedback: async (feedbackData) => {
    const response = await api.post('/user/feedback', feedbackData);
    return response.data;
  },

  getTempleFeedback: async (templeId) => {
    const response = await api.get(`/user/feedback/temple/${templeId}`);
    return response.data;
  },

  // Donations
  makeDonation: async (donationData) => {
    const response = await api.post('/user/donation', donationData);
    return response.data;
  },

  getUserDonations: async (userId) => {
    const response = await api.get(`/user/donations/${userId}`);
    return response.data;
  },

  // Events
  getEvents: async () => {
    const response = await api.get('/organizer/events');
    return response.data;
  },

  // Profile
  updateProfile: async (userId, userData) => {
    const response = await api.put(`/user/profile/${userId}`, userData);
    return response.data;
  },
};
