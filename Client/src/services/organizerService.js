import api from './api';

export const organizerService = {
  // Profile
  getProfile: async () => {
    const response = await api.get('/organizer/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/organizer/profile', profileData);
    return response.data;
  },

  // Temples
  createTemple: async (templeData) => {
    const response = await api.post('/organizer/temple', templeData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getMyTemples: async () => {
    const response = await api.get('/organizer/my-temples');
    return response.data;
  },

  updateTemple: async (templeId, templeData) => {
    const response = await api.put(`/organizer/temple/${templeId}`, templeData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteTemple: async (templeId) => {
    const response = await api.delete(`/organizer/temple/${templeId}`);
    return response.data;
  },

  // Darshans
  createDarshan: async (darshanData) => {
    const response = await api.post('/organizer/darshan', darshanData);
    return response.data;
  },

  getMyDarshans: async () => {
    const response = await api.get('/organizer/my-darshans');
    return response.data;
  },

  updateDarshan: async (darshanId, darshanData) => {
    const response = await api.put(`/organizer/darshan/${darshanId}`, darshanData);
    return response.data;
  },

  deleteDarshan: async (darshanId) => {
    const response = await api.delete(`/organizer/darshan/${darshanId}`);
    return response.data;
  },

  // Bookings
  getBookings: async () => {
    const response = await api.get('/organizer/bookings');
    return response.data;
  },

  updateBookingStatus: async (bookingId, status) => {
    const response = await api.put(`/organizer/booking/${bookingId}/status`, { status });
    return response.data;
  },

  // Events
  createEvent: async (eventData) => {
    const response = await api.post('/organizer/event', eventData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getMyEvents: async () => {
    const response = await api.get('/organizer/my-events');
    return response.data;
  },

  updateEvent: async (eventId, eventData) => {
    const response = await api.put(`/organizer/event/${eventId}`, eventData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteEvent: async (eventId) => {
    const response = await api.delete(`/organizer/event/${eventId}`);
    return response.data;
  },

  // Statistics
  getStats: async () => {
    const response = await api.get('/organizer/stats');
    return response.data;
  },
};
