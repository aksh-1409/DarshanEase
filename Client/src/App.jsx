import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Public Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import TemplesPage from './pages/user/TemplesPage';
import TempleDetails from './pages/user/TempleDetails';
import BookDarshan from './pages/user/BookDarshan';
import MyBookings from './pages/user/MyBookings';
import MyDonations from './pages/user/MyDonations';
import MyFeedback from './pages/user/MyFeedback';

// Organizer Pages
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import MyTemples from './pages/organizer/MyTemples';
import CreateTemple from './pages/organizer/CreateTemple';
import EditTemple from './pages/organizer/EditTemple';
import MyDarshans from './pages/organizer/MyDarshans';
import OrganizerBookings from './pages/organizer/OrganizerBookings';
import MyEvents from './pages/organizer/MyEvents';
import CreateEvent from './pages/organizer/CreateEvent';
import OrganizerProfile from './pages/organizer/OrganizerProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersManagement from './pages/admin/UsersManagement';
import OrganizersManagement from './pages/admin/OrganizersManagement';
import TemplesManagement from './pages/admin/TemplesManagement';
import BookingsManagement from './pages/admin/BookingsManagement';
import FeedbackManagement from './pages/admin/FeedbackManagement';
import DonationsManagement from './pages/admin/DonationsManagement';
import EventsManagement from './pages/admin/EventsManagement';
import AnalyticsManagement from './pages/admin/AnalyticsManagement';

// Profile Pages
import UserProfile from './pages/user/UserProfile';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/temples" element={<TemplesPage />} />
          <Route path="/temple/:id" element={<TempleDetails />} />

          {/* User Routes */}
          <Route element={<ProtectedRoute allowedRoles={['user']} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/book/:darshanId" element={<BookDarshan />} />
            <Route path="/user/bookings" element={<MyBookings />} />
            <Route path="/user/donations" element={<MyDonations />} />
            <Route path="/user/feedback" element={<MyFeedback />} />
            <Route path="/user/profile" element={<UserProfile />} />
          </Route>

          {/* Organizer Routes */}
          <Route element={<ProtectedRoute allowedRoles={['organizer']} />}>
            <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
            <Route path="/organizer/temples" element={<MyTemples />} />
            <Route path="/organizer/temple/create" element={<CreateTemple />} />
            <Route path="/organizer/temple/edit/:id" element={<EditTemple />} />
            <Route path="/organizer/darshans" element={<MyDarshans />} />
            <Route path="/organizer/bookings" element={<OrganizerBookings />} />
            <Route path="/organizer/events" element={<MyEvents />} />
            <Route path="/organizer/events/create" element={<CreateEvent />} />
            <Route path="/organizer/profile" element={<OrganizerProfile />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UsersManagement />} />
            <Route path="/admin/organizers" element={<OrganizersManagement />} />
            <Route path="/admin/temples" element={<TemplesManagement />} />
            <Route path="/admin/bookings" element={<BookingsManagement />} />
            <Route path="/admin/feedback" element={<FeedbackManagement />} />
            <Route path="/admin/donations" element={<DonationsManagement />} />
            <Route path="/admin/events" element={<EventsManagement />} />
            <Route path="/admin/analytics" element={<AnalyticsManagement />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
