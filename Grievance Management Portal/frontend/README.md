# Citizen Grievance Management Portal

A modern, production-ready web application for managing citizen complaints with role-based access control.

## 🚀 Features

### For Citizens
- Submit complaints with location tracking (GPS/Google Maps)
- Upload evidence images
- Track complaint status in real-time
- View detailed complaint timeline
- Provide feedback on resolved complaints
- Search and filter complaints

### For Department Officers
- View assigned complaints
- Update complaint status
- Add remarks and progress notes
- Dashboard with key metrics
- Priority-based complaint management

### For Administrators
- Comprehensive dashboard with analytics
- Manage all complaints
- Assign complaints to departments and officers
- Manage departments and officers
- View analytics and charts
- Heatmap visualization of complaint density
- Performance metrics and insights

## 🛠️ Tech Stack

- **Frontend Framework**: React.js 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: Context API
- **Charts**: Recharts
- **Icons**: Lucide React
- **Maps**: Google Maps API (placeholder)

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   ├── ProtectedRoute.jsx
│   ├── StatusBadge.jsx
│   ├── ComplaintCard.jsx
│   ├── MapPicker.jsx
│   ├── ImageUpload.jsx
│   └── FeedbackForm.jsx
├── pages/
│   ├── auth/           # Authentication pages
│   ├── citizen/        # Citizen role pages
│   ├── officer/        # Officer role pages
│   ├── admin/          # Admin role pages
│   └── common/         # Shared pages
├── context/            # React Context for state
│   └── AuthContext.jsx
├── services/           # API service layer
│   └── api.js
├── layouts/            # Layout components
│   ├── CitizenLayout.jsx
│   ├── OfficerLayout.jsx
│   └── AdminLayout.jsx
├── App.jsx             # Main app with routing
└── main.jsx            # Entry point
```

## 🚦 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit:
```
http://localhost:5173
```

## 🔐 Authentication

The application uses JWT-based authentication with role-based access control.

### Test Credentials (Mock)

**Citizen:**
- Email: citizen@example.com
- Password: password123

**Officer:**
- Email: officer@example.com
- Password: password123

**Admin:**
- Email: admin@example.com
- Password: password123

## 🎨 UI/UX Features

- **Enterprise-grade Design**: Clean, modern interface suitable for MNC standards
- **Fully Responsive**: Optimized for mobile, tablet, and desktop
- **Accessible**: WCAG compliant with proper contrast and readable fonts
- **Smooth Animations**: Hover states, transitions, and loading states
- **Professional Charts**: Data visualization with Recharts
- **Intuitive Navigation**: Sidebar navigation with active states
- **Form Validation**: Client-side validation with error messages

## 📊 Status Flow

1. **Submitted** → Complaint created by citizen
2. **Under Review** → Officer reviewing the complaint
3. **Assigned** → Assigned to specific officer
4. **In Progress** → Work in progress
5. **Work Scheduled** → Work scheduled for resolution
6. **Resolved** → Complaint resolved

## 🗺️ Google Maps Integration

The application includes placeholder for Google Maps integration:
- Location picker for complaint submission
- GPS coordinate capture
- Heatmap visualization for complaint density

To enable Google Maps:
1. Get API key from Google Cloud Console
2. Add to environment variables
3. Update MapPicker component

## 📦 API Integration

The application is configured to connect to a backend API at:
```
http://localhost:5000/api
```

### API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/complaints` - Get all complaints
- `POST /api/complaints` - Create complaint
- `PATCH /api/complaints/:id` - Update complaint
- `POST /api/complaints/:id/assign` - Assign complaint
- `GET /api/departments` - Get departments
- `POST /api/departments` - Create department
- `GET /api/officers` - Get officers
- `POST /api/officers` - Create officer
- `GET /api/analytics/stats` - Get statistics
- `GET /api/analytics/charts` - Get chart data
- `POST /api/feedback` - Submit feedback

## 🎯 Key Components

### ProtectedRoute
Handles role-based access control and authentication checks.

### StatusBadge
Displays complaint status with color-coded badges.

### ComplaintCard
Reusable card component for displaying complaint information.

### MapPicker
Location selection with GPS and map integration.

### ImageUpload
Multi-image upload with preview functionality.

### FeedbackForm
Star rating and comment form for resolved complaints.

## 🔧 Configuration

### Tailwind CSS
Custom color palette and utility classes defined in `tailwind.config.js`.

### Axios Interceptors
Automatic JWT token injection for authenticated requests.

### Context API
Global authentication state management.

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🚀 Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` directory.

## 📄 License

This project is licensed under the MIT License.

## 👥 Roles & Permissions

| Feature | Citizen | Officer | Admin |
|---------|---------|---------|-------|
| Submit Complaint | ✅ | ❌ | ❌ |
| View Own Complaints | ✅ | ❌ | ❌ |
| Update Status | ❌ | ✅ | ✅ |
| Assign Complaints | ❌ | ❌ | ✅ |
| Manage Departments | ❌ | ❌ | ✅ |
| View Analytics | ❌ | ❌ | ✅ |
| Provide Feedback | ✅ | ❌ | ❌ |

## 🎨 Color Palette

- Primary: Blue (#3b82f6)
- Success: Green (#10b981)
- Warning: Orange (#f59e0b)
- Danger: Red (#ef4444)
- Info: Purple (#8b5cf6)

## 📞 Support

For issues and questions, please open an issue in the repository.
