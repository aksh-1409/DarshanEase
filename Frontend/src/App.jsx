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
import BookDarshan from './pages/user/BookDarshan';
import MyBookings from './pages/user/MyBookings';

// Organizer Pages
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import MyTemples from './pages/organizer/MyTemples';
import CreateTemple from './pages/organizer/CreateTemple';
import MyDarshans from './pages/organizer/MyDarshans';
import OrganizerBookings from './pages/organizer/OrganizerBookings';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersManagement from './pages/admin/UsersManagement';
import OrganizersManagement from './pages/admin/OrganizersManagement';

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

          {/* User Routes */}
          <Route element={<ProtectedRoute allowedRoles={['user']} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/book/:darshanId" element={<BookDarshan />} />
            <Route path="/user/bookings" element={<MyBookings />} />
          </Route>

          {/* Organizer Routes */}
          <Route element={<ProtectedRoute allowedRoles={['organizer']} />}>
            <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
            <Route path="/organizer/temples" element={<MyTemples />} />
            <Route path="/organizer/temple/create" element={<CreateTemple />} />
            <Route path="/organizer/darshans" element={<MyDarshans />} />
            <Route path="/organizer/bookings" element={<OrganizerBookings />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UsersManagement />} />
            <Route path="/admin/organizers" element={<OrganizersManagement />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
