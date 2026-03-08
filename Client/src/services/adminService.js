import api from './api';

export const adminService = {
  // Users
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  getUserById: async (userId) => {
    const response = await api.get(`/admin/user/${userId}`);
    return response.data;
  },

  updateUser: async (userId, userData) => {
    const response = await api.put(`/admin/user/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/user/${userId}`);
    return response.data;
  },

  // Organizers
  getAllOrganizers: async () => {
    const response = await api.get('/admin/organizers');
    return response.data;
  },

  getOrganizerById: async (organizerId) => {
    const response = await api.get(`/admin/organizer/${organizerId}`);
    return response.data;
  },

  updateOrganizer: async (organizerId, organizerData) => {
    const response = await api.put(`/admin/organizer/${organizerId}`, organizerData);
    return response.data;
  },

  deleteOrganizer: async (organizerId) => {
    const response = await api.delete(`/admin/organizer/${organizerId}`);
    return response.data;
  },

  approveOrganizer: async (organizerId) => {
    const response = await api.put(`/admin/organizer/${organizerId}/approve`);
    return response.data;
  },

  // Temples
  getAllTemples: async () => {
    const response = await api.get('/admin/temples');
    return response.data;
  },

  deleteTemple: async (templeId) => {
    const response = await api.delete(`/admin/temple/${templeId}`);
    return response.data;
  },

  // Darshans
  getAllDarshans: async () => {
    const response = await api.get('/admin/darshans');
    return response.data;
  },

  deleteDarshan: async (darshanId) => {
    const response = await api.delete(`/admin/darshan/${darshanId}`);
    return response.data;
  },

  // Bookings
  getAllBookings: async () => {
    const response = await api.get('/admin/bookings');
    return response.data;
  },

  // Feedback
  getAllFeedback: async () => {
    const response = await api.get('/admin/feedback');
    return response.data;
  },

  updateFeedbackStatus: async (feedbackId, isApproved) => {
    const response = await api.put(`/admin/feedback/${feedbackId}/status`, { isApproved });
    return response.data;
  },

  deleteFeedback: async (feedbackId) => {
    const response = await api.delete(`/admin/feedback/${feedbackId}`);
    return response.data;
  },

  // Donations
  getAllDonations: async () => {
    const response = await api.get('/admin/donations');
    return response.data;
  },

  // Events
  getAllEvents: async () => {
    const response = await api.get('/admin/events');
    return response.data;
  },

  deleteEvent: async (eventId) => {
    const response = await api.delete(`/admin/event/${eventId}`);
    return response.data;
  },

  // Analytics
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  getBookingAnalytics: async (params) => {
    const response = await api.get('/admin/analytics/bookings', { params });
    return response.data;
  },

  getPopularTemples: async () => {
    const response = await api.get('/admin/analytics/popular-temples');
    return response.data;
  },

  getDevoteeDemographics: async () => {
    const response = await api.get('/admin/analytics/demographics');
    return response.data;
  },

  getBookingTrends: async () => {
    const response = await api.get('/admin/analytics/booking-trends');
    return response.data;
  },
};
