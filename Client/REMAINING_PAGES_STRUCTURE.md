# Remaining Pages to Build

## ✅ COMPLETED PAGES (8/35)
1. ✅ LandingPage.jsx
2. ✅ Login.jsx
3. ✅ Signup.jsx
4. ✅ UserDashboard.jsx
5. ✅ TemplesPage.jsx
6. ✅ MyBookings.jsx
7. ✅ UserLayout.jsx (component)
8. ✅ ProtectedRoute.jsx (component)

## 🚧 PAGES TO BUILD (27 remaining)

### User Pages (6 remaining)
- **BookDarshan.jsx** - Booking form with seat selection
- **TempleDetails.jsx** - Single temple view with darshan list
- **MyDonations.jsx** - User donations history
- **UserProfile.jsx** - Edit profile
- **FeedbackForm.jsx** - Submit feedback after visit
- **DonationForm.jsx** - Make donation to temple

### Organizer Pages (10 remaining)
- **OrganizerDashboard.jsx** - Stats, recent bookings
- **MyTemples.jsx** - List of organizer's temples
- **CreateTemple.jsx** - Add new temple form
- **EditTemple.jsx** - Update temple details
- **MyDarshans.jsx** - List of darshan slots
- **CreateDarshan.jsx** - Add darshan slot form
- **OrganizerBookings.jsx** - View all bookings
- **MyEvents.jsx** - List of events
- **CreateEvent.jsx** - Add event form
- **OrganizerProfile.jsx** - Edit profile

### Admin Pages (8 remaining)
- **AdminDashboard.jsx** - System stats, charts
- **UsersManagement.jsx** - CRUD users table
- **OrganizersManagement.jsx** - CRUD organizers, approve
- **TemplesManagement.jsx** - View/delete temples
- **BookingsManagement.jsx** - All bookings
- **FeedbackManagement.jsx** - Approve/reject feedback
- **DonationsManagement.jsx** - View all donations
- **EventsManagement.jsx** - View/delete events

### Layout Components (3 remaining)
- **OrganizerLayout.jsx** - Sidebar + navbar for organizer
- **AdminLayout.jsx** - Sidebar + navbar for admin
- **PublicNavbar.jsx** - Navbar for public pages

## 📋 PATTERN TO FOLLOW

All pages follow this structure:

```jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Icon } from '@heroicons/react/24/outline';
import Layout from '../../components/layout/Layout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { service } from '../../services/service';

const PageName = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await service.getData();
      setData(response.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="spinner" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Title</h1>
          <p className="text-gray-600">Description</p>
        </motion.div>

        {/* Content */}
        <Card className="p-6">
          {/* Your content here */}
        </Card>
      </div>
    </Layout>
  );
};

export default PageName;
```

## 🎨 DESIGN GUIDELINES

### Colors
- Primary actions: `bg-gradient-to-r from-primary to-accent`
- Secondary actions: `bg-gradient-to-r from-secondary to-secondary-light`
- Success: `bg-green-500`
- Danger: `bg-red-500`
- Warning: `bg-yellow-500`

### Status Badges
```jsx
<span className={`px-3 py-1 rounded-full text-sm font-semibold ${
  status === 'confirmed' ? 'bg-green-100 text-green-700' :
  status === 'cancelled' ? 'bg-red-100 text-red-700' :
  status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
  'bg-gray-100 text-gray-700'
}`}>
  {status}
</span>
```

### Cards with Hover
```jsx
<Card hover className="p-6">
  {/* Content */}
</Card>
```

### Forms
```jsx
<form onSubmit={handleSubmit} className="space-y-4">
  <Input
    label="Field Name"
    name="fieldName"
    value={formData.fieldName}
    onChange={handleChange}
    icon={Icon}
    required
  />
  <Button type="submit" variant="primary" fullWidth loading={loading}>
    Submit
  </Button>
</form>
```

### Tables
```jsx
<div className="overflow-x-auto">
  <table className="w-full">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
          Column
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {data.map((item) => (
        <tr key={item._id} className="hover:bg-gray-50">
          <td className="px-6 py-4 whitespace-nowrap">
            {item.field}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

### Stats Cards
```jsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {stats.map((stat) => (
    <Card key={stat.title} className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
          <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
        </div>
        <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
          <stat.icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </Card>
  ))}
</div>
```

## 🔧 SERVICES USAGE

### User Service
```javascript
import { userService } from '../../services/userService';

// Get temples
const temples = await userService.getTemples();

// Get darshans
const darshans = await userService.getDarshans({ templeId: id });

// Create booking
await userService.createBooking(bookingData);

// Get user bookings
const bookings = await userService.getUserBookings(userId);

// Submit feedback
await userService.submitFeedback(feedbackData);

// Make donation
await userService.makeDonation(donationData);
```

### Organizer Service
```javascript
import { organizerService } from '../../services/organizerService';

// Create temple
await organizerService.createTemple(formData); // FormData with image

// Get my temples
const temples = await organizerService.getMyTemples();

// Create darshan
await organizerService.createDarshan(darshanData);

// Get bookings
const bookings = await organizerService.getBookings();

// Get stats
const stats = await organizerService.getStats();
```

### Admin Service
```javascript
import { adminService } from '../../services/adminService';

// Get all users
const users = await adminService.getAllUsers();

// Update user
await adminService.updateUser(userId, userData);

// Approve organizer
await adminService.approveOrganizer(organizerId);

// Get dashboard stats
const stats = await adminService.getDashboardStats();

// Get analytics
const analytics = await adminService.getBookingAnalytics(params);
```

## 📱 RESPONSIVE DESIGN

- Mobile: Single column, collapsible sidebar
- Tablet: 2 columns, visible sidebar
- Desktop: 3 columns, full sidebar

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>
```

## 🚀 QUICK BUILD CHECKLIST

For each page:
1. [ ] Create file in correct folder
2. [ ] Import necessary components and services
3. [ ] Set up state management
4. [ ] Implement data fetching
5. [ ] Add loading state
6. [ ] Add error handling with toast
7. [ ] Implement CRUD operations
8. [ ] Add animations with framer-motion
9. [ ] Make responsive
10. [ ] Test with backend API

## 💡 TIPS

- Copy structure from existing pages (UserDashboard, MyBookings)
- Use same color scheme and animations
- All API calls should have try-catch with toast
- Always show loading spinner during async operations
- Use motion.div for page animations
- Keep consistent spacing (space-y-6, gap-6, p-6)
- Use Card component for all content blocks
- Use Button component for all actions
- Use Input component for all form fields
