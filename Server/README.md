# DarshanEase Backend API

Complete backend API for the DarshanEase temple darshan ticket booking system.

## Features

- ✅ JWT-based authentication with bcrypt password hashing
- ✅ Role-based access control (Admin, Organizer, User)
- ✅ Complete CRUD operations for all entities
- ✅ Real-time seat availability tracking
- ✅ Booking management with status tracking
- ✅ Feedback and ratings system
- ✅ Donation management
- ✅ Event management
- ✅ Analytics and reporting
- ✅ Input validation with express-validator
- ✅ Centralized error handling
- ✅ File upload support (Multer)

## Tech Stack

- Node.js & Express.js
- MongoDB & Mongoose
- JWT & bcryptjs
- Multer (file uploads)
- Express Validator
- Morgan (logging)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file in the root directory:
```env
PORT=8000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/darshanease
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

3. Start the server:
```bash
npm start
# or for development
npm run dev
```

## API Endpoints

### Authentication

#### User
- POST `/api/user/login` - User login
- POST `/api/user/signup` - User registration

#### Organizer
- POST `/api/organizer/login` - Organizer login
- POST `/api/organizer/signup` - Organizer registration

#### Admin
- POST `/api/admin/login` - Admin login
- POST `/api/admin/signup` - Admin registration

### User Routes (Protected)

- GET `/api/user/profile/:id` - Get user profile
- PUT `/api/user/profile/:id` - Update user profile
- GET `/api/user/darshan/:id` - Get darshan details
- POST `/api/user/booking` - Create booking
- GET `/api/user/bookings/:userId` - Get user bookings
- DELETE `/api/user/booking/:id` - Cancel booking
- POST `/api/user/feedback` - Submit feedback
- GET `/api/user/feedback/temple/:templeId` - Get temple feedback
- POST `/api/user/donation` - Make donation
- GET `/api/user/donations/:userId` - Get user donations

### Organizer Routes (Protected)

- GET `/api/organizer/profile` - Get organizer profile
- PUT `/api/organizer/profile` - Update organizer profile
- POST `/api/organizer/temple` - Create temple
- GET `/api/organizer/my-temples` - Get organizer temples
- GET `/api/organizer/temples` - Get all temples (public)
- GET `/api/organizer/temple/:id` - Get temple by ID
- PUT `/api/organizer/temple/:id` - Update temple
- DELETE `/api/organizer/temple/:id` - Delete temple
- POST `/api/organizer/darshan` - Create darshan slot
- GET `/api/organizer/my-darshans` - Get organizer darshans
- GET `/api/organizer/darshans` - Get all darshans (public)
- PUT `/api/organizer/darshan/:id` - Update darshan
- DELETE `/api/organizer/darshan/:id` - Delete darshan
- GET `/api/organizer/bookings` - Get organizer bookings
- PUT `/api/organizer/booking/:id/status` - Update booking status
- POST `/api/organizer/event` - Create event
- GET `/api/organizer/my-events` - Get organizer events
- GET `/api/organizer/events` - Get all events (public)
- PUT `/api/organizer/event/:id` - Update event
- DELETE `/api/organizer/event/:id` - Delete event
- GET `/api/organizer/stats` - Get organizer statistics

### Admin Routes (Protected)

#### User Management
- GET `/api/admin/users` - Get all users
- GET `/api/admin/user/:id` - Get user by ID
- PUT `/api/admin/user/:id` - Update user
- DELETE `/api/admin/user/:id` - Delete user

#### Organizer Management
- GET `/api/admin/organizers` - Get all organizers
- GET `/api/admin/organizer/:id` - Get organizer by ID
- PUT `/api/admin/organizer/:id` - Update organizer
- DELETE `/api/admin/organizer/:id` - Delete organizer
- PUT `/api/admin/organizer/:id/approve` - Approve organizer

#### System Management
- GET `/api/admin/temples` - Get all temples
- DELETE `/api/admin/temple/:id` - Delete temple
- GET `/api/admin/darshans` - Get all darshans
- DELETE `/api/admin/darshan/:id` - Delete darshan
- GET `/api/admin/bookings` - Get all bookings
- GET `/api/admin/feedback` - Get all feedback
- PUT `/api/admin/feedback/:id/status` - Approve/reject feedback
- DELETE `/api/admin/feedback/:id` - Delete feedback
- GET `/api/admin/donations` - Get all donations
- GET `/api/admin/events` - Get all events
- DELETE `/api/admin/event/:id` - Delete event

#### Analytics
- GET `/api/admin/dashboard/stats` - Get dashboard statistics
- GET `/api/admin/analytics/bookings` - Get booking analytics

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Error Handling

The API uses centralized error handling with appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Database Models

- User
- Admin
- Organizer
- Temple
- Darshan
- Booking
- Feedback
- Donation
- Event

## Project Structure

```
backend/
├── config/
│   └── db.js
├── controllers/
│   ├── adminController.js
│   ├── organizerController.js
│   └── userController.js
├── middleware/
│   └── auth.js
├── models/
│   ├── Admin.js
│   ├── Booking.js
│   ├── Darshan.js
│   ├── Donation.js
│   ├── Event.js
│   ├── Feedback.js
│   ├── Organizer.js
│   ├── Temple.js
│   └── User.js
├── routes/
│   ├── adminRoutes.js
│   ├── organizerRoutes.js
│   └── userRoutes.js
├── utils/
│   ├── auth.js
│   ├── errorHandler.js
│   └── validators.js
├── uploads/
├── .env
├── .gitignore
├── index.js
└── package.json
```

## License

MIT
