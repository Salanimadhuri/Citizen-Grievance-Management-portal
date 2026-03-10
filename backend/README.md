# Grievance Portal Backend

Complete REST API backend for Citizen Grievance Management Portal.

## Tech Stack

- **Node.js** + **Express** - Server framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **CORS** - Cross-origin requests

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Create `.env` file (already exists):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/grievance-portal
JWT_SECRET=your_jwt_secret_key_change_in_production_12345
NODE_ENV=development
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Windows
mongod

# Or use MongoDB Compass
```

### 4. Run Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will run on: `http://localhost:5000`

## API Endpoints

### Authentication

```
POST /api/auth/register - Register new user
POST /api/auth/login    - Login user
```

### Complaints

```
POST   /api/complaints              - Create complaint (Citizen)
GET    /api/complaints              - Get all complaints (Admin)
GET    /api/complaints/my           - Get my complaints (Citizen)
GET    /api/complaints/assigned     - Get assigned complaints (Officer)
GET    /api/complaints/:id          - Get complaint by ID
PATCH  /api/complaints/:id/status   - Update status (Officer/Admin)
DELETE /api/complaints/:id          - Delete complaint (Admin)
```

### Departments

```
POST   /api/departments     - Create department (Admin)
GET    /api/departments     - Get all departments
PATCH  /api/departments/:id - Update department (Admin)
DELETE /api/departments/:id - Delete department (Admin)
```

### Admin

```
POST /api/admin/officers                      - Create officer
GET  /api/admin/officers                      - Get all officers
GET  /api/admin/officers/department/:deptId   - Get officers by department
POST /api/admin/assign-complaint              - Assign complaint
GET  /api/admin/analytics                     - Get analytics data
```

### Feedback

```
POST /api/feedback/:complaintId - Submit feedback (Citizen)
GET  /api/feedback/:complaintId - Get feedback
```

## Authentication

All protected routes require JWT token in header:

```
Authorization: Bearer <token>
```

## File Uploads

Complaint images are stored in `uploads/` directory.

Access uploaded files: `http://localhost:5000/uploads/filename.jpg`

## Database Models

### User
- name, email, phone, password, role, department

### Complaint
- title, description, category, location, imageUrl, status, priorityScore, userId, departmentId, assignedOfficer, remarks, timestamps

### Department
- name, slaHours, contactEmail

### Feedback
- complaintId, userId, rating, comment

## Testing

Use Postman or Thunder Client to test APIs.

### Sample Register Request

```json
POST http://localhost:5000/api/auth/register

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "password123",
  "role": "citizen"
}
```

### Sample Login Request

```json
POST http://localhost:5000/api/auth/login

{
  "email": "john@example.com",
  "password": "password123"
}
```

## Connecting Frontend

Update frontend API base URL to: `http://localhost:5000/api`

The frontend is already configured to connect to this backend.

## Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── models/
│   ├── User.js              # User model
│   ├── Complaint.js         # Complaint model
│   ├── Department.js        # Department model
│   └── Feedback.js          # Feedback model
├── controllers/
│   ├── authController.js    # Auth logic
│   ├── complaintController.js
│   ├── departmentController.js
│   ├── adminController.js
│   └── feedbackController.js
├── routes/
│   ├── authRoutes.js
│   ├── complaintRoutes.js
│   ├── departmentRoutes.js
│   ├── adminRoutes.js
│   └── feedbackRoutes.js
├── middleware/
│   ├── authMiddleware.js    # JWT verification
│   ├── roleMiddleware.js    # Role-based access
│   └── uploadMiddleware.js  # File upload
├── utils/
│   └── generateToken.js     # JWT token generator
├── uploads/                 # Uploaded files
├── .env                     # Environment variables
├── .gitignore
├── package.json
└── server.js               # Main server file
```

## Security Features

✅ JWT Authentication
✅ Password hashing with bcrypt
✅ Role-based access control
✅ Protected routes
✅ Input validation
✅ CORS enabled
✅ File upload restrictions

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check MONGODB_URI in .env

**Port Already in Use:**
- Change PORT in .env file
- Or kill process on port 5000

**CORS Error:**
- Backend has CORS enabled
- Check frontend API base URL

## Production Deployment

1. Set NODE_ENV=production
2. Use strong JWT_SECRET
3. Use MongoDB Atlas for database
4. Deploy to Heroku/AWS/DigitalOcean
5. Use environment variables for sensitive data

## Support

For issues, check:
- MongoDB is running
- All dependencies installed
- .env file configured
- Port 5000 is available
