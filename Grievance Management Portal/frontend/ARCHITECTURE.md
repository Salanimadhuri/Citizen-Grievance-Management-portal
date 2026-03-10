# 🏗️ System Architecture Diagram

## Application Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER                                  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                    React Application                    │   │
│  │                                                          │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │              App.jsx (Router)                     │  │   │
│  │  │                                                    │  │   │
│  │  │  ┌──────────────────────────────────────────┐   │  │   │
│  │  │  │      AuthProvider (Context)              │   │  │   │
│  │  │  │  - User State                            │   │  │   │
│  │  │  │  - Token Management                      │   │  │   │
│  │  │  │  - Login/Logout                          │   │  │   │
│  │  │  └──────────────────────────────────────────┘   │  │   │
│  │  │                                                    │  │   │
│  │  │  ┌──────────────────────────────────────────┐   │  │   │
│  │  │  │         Route Protection                  │   │  │   │
│  │  │  │  - ProtectedRoute Component              │   │  │   │
│  │  │  │  - Role-Based Access Control             │   │  │   │
│  │  │  └──────────────────────────────────────────┘   │  │   │
│  │  │                                                    │  │   │
│  │  │  ┌──────────────────────────────────────────┐   │  │   │
│  │  │  │           Public Routes                   │   │  │   │
│  │  │  │  /                → Home                  │   │  │   │
│  │  │  │  /login           → Login                 │   │  │   │
│  │  │  │  /register        → Register              │   │  │   │
│  │  │  └──────────────────────────────────────────┘   │  │   │
│  │  │                                                    │  │   │
│  │  │  ┌──────────────────────────────────────────┐   │  │   │
│  │  │  │        Citizen Routes (Protected)         │   │  │   │
│  │  │  │  /citizen/dashboard                       │   │  │   │
│  │  │  │  /citizen/submit                          │   │  │   │
│  │  │  │  /citizen/complaints                      │   │  │   │
│  │  │  │  /citizen/complaints/:id                  │   │  │   │
│  │  │  │  /citizen/feedback                        │   │  │   │
│  │  │  └──────────────────────────────────────────┘   │  │   │
│  │  │                                                    │  │   │
│  │  │  ┌──────────────────────────────────────────┐   │  │   │
│  │  │  │        Officer Routes (Protected)         │   │  │   │
│  │  │  │  /officer/dashboard                       │   │  │   │
│  │  │  │  /officer/assigned                        │   │  │   │
│  │  │  │  /officer/update/:id                      │   │  │   │
│  │  │  └──────────────────────────────────────────┘   │  │   │
│  │  │                                                    │  │   │
│  │  │  ┌──────────────────────────────────────────┐   │  │   │
│  │  │  │         Admin Routes (Protected)          │   │  │   │
│  │  │  │  /admin/dashboard                         │   │  │   │
│  │  │  │  /admin/complaints                        │   │  │   │
│  │  │  │  /admin/assign                            │   │  │   │
│  │  │  │  /admin/departments                       │   │  │   │
│  │  │  │  /admin/officers                          │   │  │   │
│  │  │  │  /admin/analytics                         │   │  │   │
│  │  │  │  /admin/heatmap                           │   │  │   │
│  │  │  └──────────────────────────────────────────┘   │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  └────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS
                              │ Axios Requests
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend API Server                          │
│                   http://localhost:5000/api                      │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                  API Endpoints                          │   │
│  │                                                          │   │
│  │  /auth/login              - User authentication         │   │
│  │  /auth/register           - User registration           │   │
│  │  /complaints              - CRUD operations             │   │
│  │  /departments             - Department management       │   │
│  │  /officers                - Officer management          │   │
│  │  /analytics               - Statistics & charts         │   │
│  │  /feedback                - Feedback submission         │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                    Database                             │   │
│  │  - Users                                                │   │
│  │  - Complaints                                           │   │
│  │  - Departments                                          │   │
│  │  - Officers                                             │   │
│  │  - Feedback                                             │   │
│  └────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
App
├── AuthProvider (Context)
│   └── Router
│       ├── Public Routes
│       │   ├── Home
│       │   ├── Login
│       │   └── Register
│       │
│       ├── Citizen Routes (Protected)
│       │   └── CitizenLayout
│       │       ├── Navbar
│       │       ├── Sidebar
│       │       └── Outlet
│       │           ├── CitizenDashboard
│       │           │   ├── StatCards
│       │           │   └── ComplaintCard[]
│       │           ├── SubmitComplaint
│       │           │   ├── MapPicker
│       │           │   └── ImageUpload
│       │           ├── MyComplaints
│       │           │   ├── SearchBar
│       │           │   ├── Filters
│       │           │   └── ComplaintCard[]
│       │           ├── ComplaintDetails
│       │           │   ├── StatusBadge
│       │           │   ├── Timeline
│       │           │   └── Map
│       │           └── Feedback
│       │               └── FeedbackForm
│       │
│       ├── Officer Routes (Protected)
│       │   └── OfficerLayout
│       │       ├── Navbar
│       │       ├── Sidebar
│       │       └── Outlet
│       │           ├── OfficerDashboard
│       │           │   ├── StatCards
│       │           │   └── ComplaintCard[]
│       │           ├── AssignedComplaints
│       │           │   ├── SearchBar
│       │           │   └── Table
│       │           │       └── StatusBadge
│       │           └── UpdateStatus
│       │               ├── ComplaintSummary
│       │               └── StatusForm
│       │
│       └── Admin Routes (Protected)
│           └── AdminLayout
│               ├── Navbar
│               ├── Sidebar
│               └── Outlet
│                   ├── AdminDashboard
│                   │   ├── StatCards
│                   │   ├── PieChart
│                   │   └── BarChart
│                   ├── ComplaintManagement
│                   │   ├── SearchBar
│                   │   ├── Filters
│                   │   └── Table
│                   ├── ComplaintAssignment
│                   │   └── AssignmentForm
│                   ├── ManageDepartments
│                   │   ├── DepartmentForm
│                   │   └── DepartmentTable
│                   ├── ManageOfficers
│                   │   ├── OfficerForm
│                   │   └── OfficerTable
│                   ├── Analytics
│                   │   ├── PieChart
│                   │   ├── BarChart
│                   │   ├── LineChart
│                   │   └── MetricsCards
│                   └── HeatmapView
│                       ├── FilterPanel
│                       ├── GoogleMap
│                       └── HotspotList
```

---

## Data Flow

### Authentication Flow
```
User Input (Login Form)
    │
    ▼
AuthContext.login()
    │
    ▼
API Call: POST /api/auth/login
    │
    ▼
Backend Validates Credentials
    │
    ▼
Returns: { token, user }
    │
    ▼
Store in localStorage
    │
    ▼
Update AuthContext State
    │
    ▼
Redirect to Role-Based Dashboard
```

### Complaint Submission Flow
```
Citizen Fills Form
    │
    ▼
Select Location (GPS/Map)
    │
    ▼
Upload Images (Optional)
    │
    ▼
Submit Button Click
    │
    ▼
API Call: POST /api/complaints
    │
    ▼
Backend Creates Complaint
    │
    ▼
Returns: { complaint }
    │
    ▼
Show Success Message
    │
    ▼
Redirect to My Complaints
```

### Status Update Flow
```
Officer Views Assigned Complaint
    │
    ▼
Clicks Update Status
    │
    ▼
Selects New Status
    │
    ▼
Adds Remarks
    │
    ▼
Submit Button Click
    │
    ▼
API Call: PATCH /api/complaints/:id
    │
    ▼
Backend Updates Complaint
    │
    ▼
Returns: { updatedComplaint }
    │
    ▼
Show Success Message
    │
    ▼
Citizen Sees Updated Status
```

---

## State Management

```
┌─────────────────────────────────────────┐
│         Global State (Context)          │
│                                         │
│  AuthContext                            │
│  ├── user: User | null                  │
│  ├── token: string | null               │
│  ├── loading: boolean                   │
│  ├── login(credentials)                 │
│  ├── register(userData)                 │
│  └── logout()                           │
└─────────────────────────────────────────┘
                    │
                    │ Provides to all components
                    ▼
┌─────────────────────────────────────────┐
│       Component Local State             │
│                                         │
│  Form Data                              │
│  ├── Input values                       │
│  ├── Validation errors                  │
│  └── Submission state                   │
│                                         │
│  UI State                               │
│  ├── Loading indicators                 │
│  ├── Modal visibility                   │
│  ├── Dropdown state                     │
│  └── Filter/Search values               │
│                                         │
│  Data State                             │
│  ├── Fetched data                       │
│  ├── Filtered data                      │
│  └── Sorted data                        │
└─────────────────────────────────────────┘
```

---

## API Request Flow

```
Component
    │
    ▼
services/api.js
    │
    ├── Axios Instance
    │   ├── Base URL: http://localhost:5000/api
    │   └── Headers: { Authorization: Bearer <token> }
    │
    ▼
Request Interceptor
    │
    ├── Add JWT Token
    └── Add Headers
    │
    ▼
HTTP Request
    │
    ▼
Backend API
    │
    ▼
Response
    │
    ▼
Response Interceptor
    │
    ├── Handle Errors
    └── Transform Data
    │
    ▼
Component Receives Data
    │
    ▼
Update State
    │
    ▼
Re-render UI
```

---

## File Organization

```
src/
│
├── components/          # Reusable UI Components
│   ├── Navbar.jsx      # Top navigation
│   ├── Sidebar.jsx     # Side menu
│   ├── ProtectedRoute.jsx  # Route guard
│   ├── StatusBadge.jsx     # Status display
│   ├── ComplaintCard.jsx   # Complaint card
│   ├── MapPicker.jsx       # Location picker
│   ├── ImageUpload.jsx     # Image uploader
│   └── FeedbackForm.jsx    # Feedback form
│
├── pages/              # Page Components
│   ├── auth/          # Authentication
│   ├── citizen/       # Citizen pages
│   ├── officer/       # Officer pages
│   ├── admin/         # Admin pages
│   └── common/        # Shared pages
│
├── layouts/           # Layout Wrappers
│   ├── CitizenLayout.jsx
│   ├── OfficerLayout.jsx
│   └── AdminLayout.jsx
│
├── context/           # React Context
│   └── AuthContext.jsx
│
├── services/          # API & Services
│   ├── api.js        # API endpoints
│   └── mockData.js   # Mock data
│
├── App.jsx           # Main app
├── main.jsx          # Entry point
└── index.css         # Global styles
```

---

## Technology Stack

```
┌─────────────────────────────────────────┐
│           Frontend Stack                │
│                                         │
│  React 18                               │
│  ├── Functional Components              │
│  ├── Hooks (useState, useEffect, etc)   │
│  └── Context API                        │
│                                         │
│  React Router v6                        │
│  ├── BrowserRouter                      │
│  ├── Protected Routes                   │
│  └── Nested Routes                      │
│                                         │
│  Tailwind CSS                           │
│  ├── Utility Classes                    │
│  ├── Custom Components                  │
│  └── Responsive Design                  │
│                                         │
│  Axios                                  │
│  ├── HTTP Client                        │
│  ├── Interceptors                       │
│  └── Error Handling                     │
│                                         │
│  Recharts                               │
│  ├── Pie Charts                         │
│  ├── Bar Charts                         │
│  └── Line Charts                        │
│                                         │
│  Lucide React                           │
│  └── Icon Library                       │
│                                         │
│  Vite                                   │
│  ├── Build Tool                         │
│  ├── Dev Server                         │
│  └── Hot Module Replacement             │
└─────────────────────────────────────────┘
```

---

## Security Architecture

```
┌─────────────────────────────────────────┐
│         Security Layers                 │
│                                         │
│  1. Authentication                      │
│     ├── JWT Tokens                      │
│     ├── Token Storage (localStorage)    │
│     └── Token Expiration                │
│                                         │
│  2. Authorization                       │
│     ├── Role-Based Access Control       │
│     ├── Protected Routes                │
│     └── API Permission Checks           │
│                                         │
│  3. Input Validation                    │
│     ├── Client-Side Validation          │
│     ├── Form Validation                 │
│     └── File Upload Restrictions        │
│                                         │
│  4. Data Protection                     │
│     ├── HTTPS (Production)              │
│     ├── Secure Headers                  │
│     └── XSS Prevention (React)          │
└─────────────────────────────────────────┘
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│         Production Setup                │
│                                         │
│  CDN (CloudFront/Cloudflare)            │
│  ├── Static Assets                      │
│  ├── Caching                            │
│  └── HTTPS                              │
│         │                               │
│         ▼                               │
│  Web Server (Nginx/Vercel)              │
│  ├── Serve React App                    │
│  ├── Route Handling                     │
│  └── Compression                        │
│         │                               │
│         ▼                               │
│  Backend API                            │
│  ├── Authentication                     │
│  ├── Business Logic                     │
│  └── Database Access                    │
│         │                               │
│         ▼                               │
│  Database                               │
│  ├── User Data                          │
│  ├── Complaints                         │
│  └── System Data                        │
└─────────────────────────────────────────┘
```

---

**Visual Architecture Complete! 🎨**
