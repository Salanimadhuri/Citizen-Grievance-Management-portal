# 📑 Complete Project Index

## 🎯 Quick Navigation

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Features by Role](#features-by-role)
- [Components Reference](#components-reference)
- [Pages Reference](#pages-reference)
- [API Endpoints](#api-endpoints)
- [Documentation Files](#documentation-files)

---

## 🚀 Getting Started

1. **Read First**: [QUICKSTART.md](./QUICKSTART.md)
2. **Setup Guide**: [README.md](./README.md)
3. **Technical Details**: [DOCUMENTATION.md](./DOCUMENTATION.md)
4. **Deploy**: [DEPLOYMENT.md](./DEPLOYMENT.md)
5. **Summary**: [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)

---

## 📁 Project Structure

### Root Files
```
frontend/
├── .env.example              # Environment variables template
├── .gitignore               # Git ignore rules
├── index.html               # HTML entry point
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── vite.config.js           # Vite build configuration
├── README.md                # Main documentation
├── QUICKSTART.md            # Quick start guide
├── DOCUMENTATION.md         # Technical documentation
├── DEPLOYMENT.md            # Deployment guide
└── PROJECT_SUMMARY.md       # Project summary
```

### Source Code Structure
```
src/
├── components/              # 8 reusable components
├── pages/                   # 18 pages (auth, citizen, officer, admin, common)
├── layouts/                 # 3 role-based layouts
├── context/                 # Authentication context
├── services/                # API service and mock data
├── App.jsx                  # Main app with routing
├── main.jsx                 # Entry point
└── index.css                # Global styles
```

---

## 🎭 Features by Role

### 👤 Citizen (5 Pages)
1. **Dashboard** - Statistics and recent complaints
2. **Submit Complaint** - Form with location and images
3. **My Complaints** - List with search and filter
4. **Complaint Details** - Full details with timeline
5. **Feedback** - Rate resolved complaints

### 👮 Officer (3 Pages)
1. **Dashboard** - Assigned complaints statistics
2. **Assigned Complaints** - Table view with search
3. **Update Status** - Status update form

### 👨💼 Admin (7 Pages)
1. **Dashboard** - System-wide statistics and charts
2. **Complaint Management** - All complaints table
3. **Complaint Assignment** - Assign to departments/officers
4. **Manage Departments** - CRUD operations
5. **Manage Officers** - Add and view officers
6. **Analytics** - Comprehensive charts and metrics
7. **Heatmap View** - Location-based visualization

### 🌐 Common (2 Pages)
1. **Home** - Landing page
2. **Not Found** - 404 error page

### 🔐 Auth (2 Pages)
1. **Login** - User authentication
2. **Register** - User registration

---

## 🧩 Components Reference

### 1. Navbar.jsx
**Purpose**: Top navigation bar
**Features**:
- User profile display
- Notification bell
- Logout button
- Role indicator

**Props**: None (uses AuthContext)

---

### 2. Sidebar.jsx
**Purpose**: Side navigation menu
**Features**:
- Dynamic menu items
- Active route highlighting
- Icon + label display

**Props**:
```javascript
{
  menuItems: Array<{
    path: string,
    label: string,
    icon: Component
  }>
}
```

---

### 3. ProtectedRoute.jsx
**Purpose**: Route protection and role-based access
**Features**:
- Authentication check
- Role validation
- Loading state
- Auto redirect

**Props**:
```javascript
{
  children: ReactNode,
  allowedRoles: Array<string>
}
```

---

### 4. StatusBadge.jsx
**Purpose**: Display complaint status
**Features**:
- Color-coded badges
- 6 status types
- Consistent styling

**Props**:
```javascript
{
  status: string // 'Submitted' | 'Under Review' | 'Assigned' | 'In Progress' | 'Work Scheduled' | 'Resolved'
}
```

**Colors**:
- Submitted → Gray
- Under Review → Blue
- Assigned → Purple
- In Progress → Orange
- Work Scheduled → Yellow
- Resolved → Green

---

### 5. ComplaintCard.jsx
**Purpose**: Reusable complaint display card
**Features**:
- Complaint summary
- Status badge
- Metadata (category, location, date)
- Click to view details

**Props**:
```javascript
{
  complaint: Object,
  basePath: string // default: '/citizen'
}
```

---

### 6. MapPicker.jsx
**Purpose**: Location selection interface
**Features**:
- GPS coordinate capture
- Address input
- Map preview
- Current location button

**Props**:
```javascript
{
  onLocationSelect: Function,
  initialLocation: { lat: number, lng: number }
}
```

---

### 7. ImageUpload.jsx
**Purpose**: Multi-image upload with preview
**Features**:
- Drag and drop
- Multiple file selection
- Image preview
- Remove images
- File validation

**Props**:
```javascript
{
  onImageSelect: Function,
  maxFiles: number // default: 3
}
```

---

### 8. FeedbackForm.jsx
**Purpose**: Rating and feedback submission
**Features**:
- 5-star rating
- Comment textarea
- Hover effects
- Validation

**Props**:
```javascript
{
  complaintId: number,
  onSubmit: Function
}
```

---

## 📄 Pages Reference

### Authentication Pages

#### Login.jsx
**Route**: `/login`
**Access**: Public
**Features**:
- Email/password form
- Error handling
- Role-based redirect
- Link to register

#### Register.jsx
**Route**: `/register`
**Access**: Public
**Features**:
- Full registration form
- Role selection
- Password confirmation
- Success notification

---

### Citizen Pages

#### CitizenDashboard.jsx
**Route**: `/citizen/dashboard`
**Access**: Citizen only
**Features**:
- 3 statistics cards
- Recent complaints
- Quick navigation

#### SubmitComplaint.jsx
**Route**: `/citizen/submit`
**Access**: Citizen only
**Features**:
- Complaint form
- Category dropdown
- Location picker
- Image upload
- Form validation

#### MyComplaints.jsx
**Route**: `/citizen/complaints`
**Access**: Citizen only
**Features**:
- Complaints list
- Search functionality
- Category filter
- Status filter
- Complaint cards

#### ComplaintDetails.jsx
**Route**: `/citizen/complaints/:id`
**Access**: Citizen only
**Features**:
- Full complaint details
- Status timeline
- Location map
- Evidence images
- Back navigation

#### Feedback.jsx
**Route**: `/citizen/feedback`
**Access**: Citizen only
**Features**:
- Resolved complaints list
- Star rating
- Comment submission
- Success notification

---

### Officer Pages

#### OfficerDashboard.jsx
**Route**: `/officer/dashboard`
**Access**: Officer only
**Features**:
- 3 statistics cards
- Recent assignments
- Quick access

#### AssignedComplaints.jsx
**Route**: `/officer/assigned`
**Access**: Officer only
**Features**:
- Complaints table
- Search functionality
- Priority indicators
- Status badges
- View details action

#### UpdateStatus.jsx
**Route**: `/officer/update/:id`
**Access**: Officer only
**Features**:
- Complaint summary
- Status dropdown
- Remarks textarea
- Update button
- Success notification

---

### Admin Pages

#### AdminDashboard.jsx
**Route**: `/admin/dashboard`
**Access**: Admin only
**Features**:
- 4 statistics cards
- Pie chart (categories)
- Bar chart (status)
- System overview

#### ComplaintManagement.jsx
**Route**: `/admin/complaints`
**Access**: Admin only
**Features**:
- All complaints table
- Search functionality
- Status filter
- View details
- Assign action

#### ComplaintAssignment.jsx
**Route**: `/admin/assign`
**Access**: Admin only
**Features**:
- Complaint selection
- Department dropdown
- Officer dropdown (filtered)
- Priority selection
- Assignment form

#### ManageDepartments.jsx
**Route**: `/admin/departments`
**Access**: Admin only
**Features**:
- Departments table
- Create department
- Edit department
- Delete department
- SLA configuration

#### ManageOfficers.jsx
**Route**: `/admin/officers`
**Access**: Admin only
**Features**:
- Officers table
- Add officer form
- Department assignment
- Contact information

#### Analytics.jsx
**Route**: `/admin/analytics`
**Access**: Admin only
**Features**:
- 4 chart types
- Key metrics cards
- Category distribution
- Resolution rate
- Department performance
- Monthly trends

#### HeatmapView.jsx
**Route**: `/admin/heatmap`
**Access**: Admin only
**Features**:
- Google Maps integration
- Complaint density heatmap
- Filter by category
- Filter by status
- Date range filter
- Hotspot locations list

---

### Common Pages

#### Home.jsx
**Route**: `/`
**Access**: Public
**Features**:
- Landing page
- Feature highlights
- Call to action
- Navigation to login/register

#### NotFound.jsx
**Route**: `*` (404)
**Access**: Public
**Features**:
- 404 message
- Back button
- Home button

---

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/login
POST /api/auth/register
```

### Complaints
```
GET    /api/complaints
POST   /api/complaints
GET    /api/complaints/:id
GET    /api/complaints/my
PATCH  /api/complaints/:id
POST   /api/complaints/:id/assign
```

### Departments
```
GET    /api/departments
POST   /api/departments
PATCH  /api/departments/:id
DELETE /api/departments/:id
```

### Officers
```
GET /api/officers
POST /api/officers
GET /api/officers/department/:deptId
```

### Analytics
```
GET /api/analytics/stats
GET /api/analytics/charts
GET /api/analytics/heatmap
```

### Feedback
```
POST /api/feedback
```

---

## 📚 Documentation Files

### 1. README.md
**Purpose**: Main project documentation
**Contents**:
- Project overview
- Features list
- Tech stack
- Installation guide
- Usage instructions
- API endpoints
- Roles and permissions

### 2. QUICKSTART.md
**Purpose**: Quick setup guide
**Contents**:
- 5-minute setup
- Test credentials
- Feature tour
- Development commands
- Common issues

### 3. DOCUMENTATION.md
**Purpose**: Technical documentation
**Contents**:
- Architecture overview
- Component details
- API integration
- State management
- Security considerations
- Performance optimization
- Testing strategy

### 4. DEPLOYMENT.md
**Purpose**: Deployment guide
**Contents**:
- Pre-deployment checklist
- Platform-specific guides (Vercel, Netlify, AWS, Docker)
- Environment variables
- Security considerations
- CI/CD pipeline
- Monitoring setup

### 5. PROJECT_SUMMARY.md
**Purpose**: Complete project summary
**Contents**:
- Project statistics
- File structure
- Implemented features
- UI/UX features
- Technical implementation
- Charts and visualizations
- Forms and validation

---

## 🎨 Styling System

### Tailwind Classes
```css
/* Buttons */
.btn-primary     - Primary action button
.btn-secondary   - Secondary action button

/* Layout */
.card            - Card container
.input-field     - Form input
.label           - Form label

/* Colors */
primary-*        - Blue shades
gray-*           - Gray scale
green-*          - Success
orange-*         - Warning
red-*            - Danger
```

### Status Colors
```
Submitted      → bg-gray-100 text-gray-700
Under Review   → bg-blue-100 text-blue-700
Assigned       → bg-purple-100 text-purple-700
In Progress    → bg-orange-100 text-orange-700
Work Scheduled → bg-yellow-100 text-yellow-700
Resolved       → bg-green-100 text-green-700
```

---

## 🔧 Configuration Files

### package.json
- Dependencies list
- Scripts (dev, build, preview)
- Project metadata

### tailwind.config.js
- Custom color palette
- Content paths
- Theme extensions

### vite.config.js
- Build configuration
- Plugin setup
- Dev server settings

### postcss.config.js
- Tailwind CSS plugin
- Autoprefixer plugin

---

## 📊 Data Models

### User
```javascript
{
  id: number,
  name: string,
  email: string,
  phone: string,
  role: 'citizen' | 'officer' | 'admin',
  department?: string
}
```

### Complaint
```javascript
{
  id: number,
  title: string,
  description: string,
  category: string,
  location: string,
  coordinates: { lat: number, lng: number },
  status: string,
  priority: 'Low' | 'Medium' | 'High',
  citizen: string,
  department?: string,
  officer?: string,
  images: string[],
  createdAt: string,
  reviewedAt?: string,
  assignedAt?: string,
  inProgressAt?: string,
  resolvedAt?: string,
  feedbackSubmitted?: boolean
}
```

### Department
```javascript
{
  id: number,
  name: string,
  slaHours: number,
  contactEmail: string
}
```

### Officer
```javascript
{
  id: number,
  name: string,
  email: string,
  phone: string,
  department: string
}
```

---

## 🎯 Key Features Summary

✅ **Authentication**: JWT-based with role management
✅ **Role-Based Access**: 3 distinct user roles
✅ **Complaint Management**: Full CRUD operations
✅ **Location Services**: GPS and map integration
✅ **Image Upload**: Multi-file with preview
✅ **Search & Filter**: Advanced filtering options
✅ **Analytics**: Charts and metrics
✅ **Responsive Design**: Mobile, tablet, desktop
✅ **Status Tracking**: Timeline visualization
✅ **Feedback System**: Star rating and comments

---

## 📞 Support Resources

- **Quick Help**: QUICKSTART.md
- **Setup Issues**: README.md
- **Technical Questions**: DOCUMENTATION.md
- **Deployment Help**: DEPLOYMENT.md
- **Feature Overview**: PROJECT_SUMMARY.md

---

## 🎓 Learning Path

1. Start with QUICKSTART.md
2. Explore component files
3. Review page implementations
4. Study API integration
5. Understand routing
6. Learn state management
7. Master styling system
8. Deploy to production

---

**Complete Index - Everything You Need to Know! 📚**
