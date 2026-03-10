# Citizen Grievance Management Portal - Technical Documentation

## Overview
A production-ready, enterprise-grade web application for managing citizen complaints with role-based dashboards, real-time tracking, and comprehensive analytics.

## Architecture

### Frontend Architecture
- **Framework**: React 18 with functional components and hooks
- **State Management**: Context API for authentication, local state for components
- **Routing**: React Router v6 with protected routes
- **Styling**: Tailwind CSS with custom utility classes
- **API Layer**: Axios with interceptors for authentication

### Component Hierarchy
```
App (Router + AuthProvider)
├── Public Routes
│   ├── Home
│   ├── Login
│   └── Register
├── Citizen Routes (Protected)
│   └── CitizenLayout (Navbar + Sidebar)
│       ├── CitizenDashboard
│       ├── SubmitComplaint
│       ├── MyComplaints
│       ├── ComplaintDetails
│       └── Feedback
├── Officer Routes (Protected)
│   └── OfficerLayout (Navbar + Sidebar)
│       ├── OfficerDashboard
│       ├── AssignedComplaints
│       └── UpdateStatus
└── Admin Routes (Protected)
    └── AdminLayout (Navbar + Sidebar)
        ├── AdminDashboard
        ├── ComplaintManagement
        ├── ComplaintAssignment
        ├── ManageDepartments
        ├── ManageOfficers
        ├── Analytics
        └── HeatmapView
```

## Key Features Implementation

### 1. Authentication System
- JWT token-based authentication
- Token stored in localStorage
- Automatic token injection via Axios interceptors
- Role-based access control
- Protected routes with redirect logic

### 2. Role-Based Dashboards

#### Citizen Dashboard
- Statistics cards (Total, In Progress, Resolved)
- Recent complaints list
- Quick access to submit new complaint
- Search and filter functionality

#### Officer Dashboard
- Assigned complaints count
- In-progress tracking
- Today's resolved count
- Quick status update access

#### Admin Dashboard
- System-wide statistics
- Multiple chart visualizations
- Department performance metrics
- Monthly trends analysis

### 3. Complaint Management

#### Submission Flow
1. Citizen fills form (title, description, category)
2. Selects location via GPS or map
3. Uploads evidence images (optional)
4. Submits complaint
5. Receives confirmation

#### Status Update Flow
1. Admin assigns to department/officer
2. Officer reviews and updates status
3. Status progresses through workflow
4. Citizen receives updates
5. Upon resolution, citizen provides feedback

### 4. Location Services
- GPS coordinate capture
- Google Maps integration (placeholder)
- Address input with autocomplete
- Location visualization on complaint details
- Heatmap for complaint density

### 5. Analytics & Reporting
- Pie charts for category distribution
- Bar charts for status breakdown
- Line charts for monthly trends
- Department performance comparison
- Key metrics dashboard
- Exportable reports (future enhancement)

## Component Details

### Core Components

#### ProtectedRoute
```javascript
Purpose: Enforce authentication and role-based access
Props: children, allowedRoles
Logic: Check user authentication and role, redirect if unauthorized
```

#### StatusBadge
```javascript
Purpose: Display complaint status with color coding
Props: status
Colors: Gray (Submitted), Blue (Under Review), Purple (Assigned), 
        Orange (In Progress), Green (Resolved)
```

#### ComplaintCard
```javascript
Purpose: Reusable card for displaying complaint summary
Props: complaint, basePath
Features: Click to view details, status badge, metadata display
```

#### MapPicker
```javascript
Purpose: Location selection interface
Features: GPS capture, address input, map preview
Integration: Google Maps API (placeholder)
```

#### ImageUpload
```javascript
Purpose: Multi-image upload with preview
Features: Drag-and-drop, preview thumbnails, remove images
Validation: File type, size limits
```

#### FeedbackForm
```javascript
Purpose: Star rating and comment submission
Features: 5-star rating, text comment, validation
Trigger: Only for resolved complaints
```

### Layout Components

#### Navbar
- User profile display
- Notification bell (placeholder)
- Logout functionality
- Role indicator

#### Sidebar
- Dynamic menu based on role
- Active route highlighting
- Icon + label navigation
- Responsive collapse (future)

## API Integration

### Endpoints Structure
```
/api/auth
  POST /login
  POST /register

/api/complaints
  GET / (with query params)
  POST /
  GET /:id
  PATCH /:id
  POST /:id/assign

/api/departments
  GET /
  POST /
  PATCH /:id
  DELETE /:id

/api/officers
  GET /
  POST /
  GET /department/:deptId

/api/analytics
  GET /stats
  GET /charts
  GET /heatmap

/api/feedback
  POST /
```

### Request/Response Format
```javascript
// Login Request
{
  email: string,
  password: string
}

// Login Response
{
  token: string,
  user: {
    id: number,
    name: string,
    email: string,
    role: string
  }
}

// Complaint Creation
{
  title: string,
  description: string,
  category: string,
  location: { lat: number, lng: number },
  address: string,
  images: string[]
}
```

## State Management

### AuthContext
```javascript
State:
  - user: User object or null
  - token: JWT token string
  - loading: Boolean

Methods:
  - login(credentials): Authenticate user
  - register(userData): Create new user
  - logout(): Clear session
```

### Local Component State
- Form data
- Loading states
- Error messages
- Success notifications
- Filter/search parameters

## Styling System

### Tailwind Configuration
- Custom color palette (primary blue)
- Responsive breakpoints
- Custom utility classes
- Component classes (btn-primary, card, input-field)

### Design Tokens
```css
Colors:
  - Primary: #3b82f6 (Blue)
  - Success: #10b981 (Green)
  - Warning: #f59e0b (Orange)
  - Danger: #ef4444 (Red)
  - Gray scale: 50-900

Typography:
  - Font: System fonts
  - Sizes: xs, sm, base, lg, xl, 2xl, 3xl

Spacing:
  - Scale: 0.25rem increments
  - Container: max-w-7xl
```

## Security Considerations

1. **Authentication**
   - JWT tokens with expiration
   - Secure token storage
   - Automatic logout on token expiry

2. **Authorization**
   - Role-based route protection
   - API-level permission checks
   - UI element visibility based on role

3. **Input Validation**
   - Client-side form validation
   - XSS prevention (React default)
   - File upload restrictions

4. **Data Privacy**
   - No sensitive data in localStorage
   - HTTPS enforcement (production)
   - Secure API communication

## Performance Optimization

1. **Code Splitting**
   - Route-based lazy loading (future)
   - Component lazy loading for heavy components

2. **Asset Optimization**
   - Image compression
   - SVG icons (Lucide)
   - Minified production build

3. **Caching Strategy**
   - API response caching
   - Static asset caching
   - Service worker (future)

## Testing Strategy

### Unit Tests (Future)
- Component rendering
- User interactions
- Form validation
- Utility functions

### Integration Tests (Future)
- API integration
- Authentication flow
- Route navigation
- Role-based access

### E2E Tests (Future)
- Complete user workflows
- Cross-browser testing
- Responsive design testing

## Deployment

### Build Process
```bash
npm run build
```
Output: `dist/` directory with optimized assets

### Environment Variables
- VITE_API_BASE_URL: Backend API URL
- VITE_GOOGLE_MAPS_API_KEY: Maps API key
- VITE_ENV: Environment identifier

### Hosting Options
- Vercel (recommended)
- Netlify
- AWS S3 + CloudFront
- Traditional web server (Nginx/Apache)

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility
- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Proper ARIA labels
- Color contrast ratios

## Future Enhancements

1. **Real-time Updates**
   - WebSocket integration
   - Live notifications
   - Real-time status updates

2. **Advanced Features**
   - Multi-language support (i18n)
   - Dark mode
   - Offline support (PWA)
   - Mobile app (React Native)

3. **Analytics**
   - Advanced reporting
   - Export to PDF/Excel
   - Custom date ranges
   - Predictive analytics

4. **Communication**
   - In-app messaging
   - Email notifications
   - SMS alerts
   - Push notifications

## Development Guidelines

### Code Style
- Use functional components
- Prefer hooks over class components
- Follow ESLint rules
- Use meaningful variable names
- Add comments for complex logic

### Git Workflow
- Feature branches
- Pull request reviews
- Semantic commit messages
- Version tagging

### File Naming
- Components: PascalCase (e.g., ComplaintCard.jsx)
- Utilities: camelCase (e.g., formatDate.js)
- Constants: UPPER_SNAKE_CASE

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check backend server is running
   - Verify API_BASE_URL in .env
   - Check CORS configuration

2. **Authentication Issues**
   - Clear localStorage
   - Check token expiration
   - Verify API endpoints

3. **Build Errors**
   - Delete node_modules and reinstall
   - Clear Vite cache
   - Check Node.js version

## Support & Maintenance

### Monitoring
- Error tracking (Sentry integration recommended)
- Performance monitoring
- User analytics
- API health checks

### Updates
- Regular dependency updates
- Security patches
- Feature releases
- Bug fixes

## Contact & Resources

- Documentation: README.md
- API Docs: (Backend repository)
- Issue Tracker: GitHub Issues
- Support: support@example.com
