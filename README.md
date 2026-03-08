# 🕉️ DarshanEase - Temple Darshan Ticket Booking System

A comprehensive MERN stack application for booking temple darshan slots online, managing temple operations, and providing analytics for administrators.


## ✨ Features

### For Users (Devotees)
- 👤 User registration and authentication
- 🏛️ Browse temples and view details
- 📅 View available darshan slots
- 🎫 Book darshan tickets online
- 💳 E-ticket generation
- 💰 Make donations to temples
- ⭐ Submit feedback and ratings
- 📱 Manage profile and bookings

### For Organizers (Temple Management)
- 🏛️ Register and manage temples
- 📅 Create and manage darshan slots
- 🎟️ View and manage bookings
- 📊 Dashboard with statistics
- 🎉 Create and manage temple events
- 👥 Profile management

### For Administrators
- 👥 Manage users and organizers
- 🏛️ Manage temples and darshans
- 🎫 View all bookings
- 💬 Approve/reject feedback
- 💰 Monitor donations
- 📊 Comprehensive analytics and reports
- 📈 Generate PDF and Excel reports
- 📉 View popular temples and trends

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Heroicons** - Icons
- **React Hot Toast** - Notifications
- **Axios** - HTTP client
- **jsPDF** - PDF generation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**
- **Git**

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/darshanease.git
cd darshanease
```

### 2. Setup Backend (Server)
```bash
cd Server
npm install
```

Create a `.env` file in the Server directory:
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
PORT=8000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/darshanease
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### 3. Setup Frontend (Client)
```bash
cd ../Client
npm install
```

### 4. Setup MongoDB
Make sure MongoDB is running on your system:
```bash
# For Windows
net start MongoDB

# For macOS/Linux
sudo systemctl start mongod
```

## 🎯 Running the Application

### Start Backend Server
```bash
cd Server
node index.js
```
Backend will run on: `http://localhost:8000`

### Start Frontend Development Server
```bash
cd Client
npm run dev
```
Frontend will run on: `http://localhost:5173`

### Access the Application
Open your browser and navigate to: `http://localhost:5173`

## 📁 Project Structure

```
darshanease/
├── Server/                 # Backend application
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── uploads/          # Uploaded files
│   ├── index.js          # Entry point
│   └── .env.example      # Environment variables template
│
├── Client/                # Frontend application
│   ├── public/           # Static files
│   ├── src/
│   │   ├── assets/       # Images, fonts
│   │   ├── components/   # Reusable components
│   │   ├── context/      # React context
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   └── package.json
│
└── README.md
```

## 👥 User Roles

### 1. User (Devotee)
- Default role for new registrations
- Can book darshan slots
- Can make donations
- Can submit feedback

### 2. Organizer (Temple Manager)
- Manages temple information
- Creates darshan slots
- Views bookings for their temples
- Manages temple events

### 3. Admin
- Full system access
- Manages all users and organizers
- Approves/rejects feedback
- Views analytics and generates reports

## 🔑 Default Credentials

You'll need to create accounts through the signup page. For admin access, you can create an admin account using the admin signup endpoint.

## 📡 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Authentication Endpoints
- `POST /user/login` - User login
- `POST /user/signup` - User registration
- `POST /organizer/login` - Organizer login
- `POST /organizer/signup` - Organizer registration
- `POST /admin/login` - Admin login
- `POST /admin/signup` - Admin registration

### User Endpoints
- `GET /user/profile/:id` - Get user profile
- `PUT /user/profile/:id` - Update profile
- `POST /user/booking` - Create booking
- `GET /user/bookings/:userId` - Get user bookings
- `POST /user/feedback` - Submit feedback
- `POST /user/donation` - Make donation

### Organizer Endpoints
- `POST /organizer/temple` - Create temple
- `GET /organizer/temples` - Get all temples
- `POST /organizer/darshan` - Create darshan slot
- `GET /organizer/darshans` - Get darshan slots
- `GET /organizer/bookings/:organizerId` - Get bookings

### Admin Endpoints
- `GET /admin/users` - Get all users
- `GET /admin/organizers` - Get all organizers
- `GET /admin/temples` - Get all temples
- `GET /admin/bookings` - Get all bookings
- `GET /admin/feedback` - Get all feedback
- `GET /admin/analytics/popular-temples` - Get popular temples
- `GET /admin/analytics/demographics` - Get user demographics
- `GET /admin/analytics/booking-trends` - Get booking trends

## 🎨 Key Features Explained

### 1. Darshan Booking System
- Real-time seat availability
- Multiple ticket types (Normal/VIP)
- Instant booking confirmation
- E-ticket generation with QR code

### 2. Analytics Dashboard
- Popular temples ranking (by bookings or revenue)
- Booking trends over time
- Devotee demographics (gender, age, location)
- Revenue analytics
- Export reports as PDF or Excel

### 3. Feedback System
- Users can rate temples (1-5 stars)
- Write detailed reviews
- Admin approval required before publishing
- Displayed on temple detail pages

### 4. Temple Management
- Upload temple images
- Set darshan timings
- Manage pricing (Normal/VIP)
- Track available seats
