# Developer Quick Reference Guide

## Project Structure

```
Grievance Management Portal/
├── backend/
│   ├── models/
│   │   ├── Complaint.js
│   │   ├── User.js
│   │   ├── Feedback.js
│   │   ├── Communication.js
│   │   └── ...
│   ├── controllers/
│   │   ├── complaintController.js
│   │   ├── feedbackController.js
│   │   ├── communicationController.js
│   │   └── ...
│   ├── routes/
│   │   ├── complaintRoutes.js
│   │   ├── feedbackRoutes.js
│   │   ├── communicationRoutes.js
│   │   └── ...
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── uploadMiddleware.js
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── officer/
    │   │   │   ├── OfficerDashboard.jsx
    │   │   │   ├── OfficerComplaints.jsx
    │   │   │   ├── OfficerComplaintManagement.jsx
    │   │   │   ├── OfficerFeedback.jsx
    │   │   │   ├── OfficerCommunication.jsx
    │   │   │   └── QuickActions.jsx
    │   │   ├── citizen/
    │   │   │   ├── CitizenDashboard.jsx
    │   │   │   ├── MyComplaints.jsx
    │   │   │   ├── Feedback.jsx
    │   │   │   ├── CitizenCommunication.jsx
    │   │   │   └── ...
    │   │   └── admin/
    │   │       ├── AdminDashboard.jsx
    │   │       └── ...
    │   ├── components/
    │   │   ├── StatusBadge.jsx
    │   │   ├── StatisticsCharts.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── Sidebar.jsx
    │   │   └── ...
    │   ├── layouts/
    │   │   ├── OfficerLayout.jsx
    │   │   ├── CitizenLayout.jsx
    │   │   └── AdminLayout.jsx
    │   ├── services/
    │   │   └── api.js
    │   └── App.jsx
    └── package.json
```

## Key API Endpoints

### Complaints
```
GET    /api/complaints              - Get all complaints (admin)
GET    /api/complaints/my           - Get my complaints (citizen)
GET    /api/complaints/officer      - Get assigned complaints (officer)
GET    /api/complaints/:id          - Get complaint details
POST   /api/complaints              - Create complaint (citizen)
PATCH  /api/complaints/:id/status   - Update status (officer/admin)
PATCH  /api/complaints/:id/assign   - Assign complaint (admin)
```

### Feedback
```
POST   /api/feedback                - Create feedback (citizen)
GET    /api/feedback/recent         - Get recent feedback
GET    /api/feedback/officer        - Get officer feedback
GET    /api/feedback/:complaintId   - Get feedback for complaint
```

### Communication
```
POST   /api/communications          - Send message
GET    /api/communications/conversations - Get all conversations
GET    /api/communications/:complaintId  - Get messages for complaint
```

## Common Tasks

### Adding a New Status
1. Update `Complaint.js` model enum
2. Update `statusConfig` in `StatusBadge.jsx`
3. Update `statusOptions` in `OfficerComplaintManagement.jsx`
4. Update timeline in relevant components

### Adding a New Role
1. Create new layout in `layouts/`
2. Add role to `roleMiddleware.js`
3. Create new pages in `pages/`
4. Add routes in `App.jsx`
5. Update `ProtectedRoute.jsx`

### Adding a New Feature
1. Create model in `backend/models/`
2. Create controller in `backend/controllers/`
3. Create routes in `backend/routes/`
4. Add routes to `server.js`
5. Create API methods in `frontend/services/api.js`
6. Create React components in `frontend/src/pages/`
7. Add routes in `App.jsx`

## Authentication Flow

```
1. User submits login credentials
2. Backend validates and returns JWT token
3. Token stored in localStorage
4. Token sent in Authorization header for all requests
5. Middleware verifies token and extracts user info
6. Role-based access control applied
```

## Authorization Levels

**Citizen:**
- View own complaints
- Submit new complaints
- Provide feedback for resolved complaints
- Message assigned officer

**Officer:**
- View assigned complaints
- Update complaint status
- Mark complaints as resolved
- View feedback from citizens
- Message citizens about assigned complaints

**Admin:**
- View all complaints
- Assign complaints to officers
- Update any complaint status
- View all communications
- Manage departments and officers

## Error Handling

### Backend
```javascript
try {
  // operation
} catch (error) {
  res.status(500).json({ message: error.message });
}
```

### Frontend
```javascript
try {
  const response = await api.get('/endpoint');
  setData(response.data);
} catch (error) {
  setError(error.response?.data?.message || 'Error occurred');
}
```

## State Management

**Local State:**
- Component-level state using `useState`
- Form inputs and UI state

**Context:**
- `AuthContext` - User authentication and role
- Global user state

**API State:**
- Data fetched from backend
- Cached in component state

## Styling

**Tailwind CSS Classes:**
- `.card` - Card component styling
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.btn-success` - Success button
- `.input-field` - Input styling
- `.label` - Label styling

**Color Palette:**
- Primary: `#1976D2` (blue)
- Brand Primary: `#D98880` (terracotta)
- Brand Light: `#FEF9E7` (cream)
- Success: Green
- Warning: Orange
- Error: Red

## Testing

### Manual Testing Checklist
- [ ] Login with different roles
- [ ] Create complaint as citizen
- [ ] Assign complaint as admin
- [ ] Update status as officer
- [ ] Mark as resolved
- [ ] Submit feedback
- [ ] Send message
- [ ] View analytics
- [ ] Check responsive design

### API Testing
Use Postman or similar tool:
1. Set Authorization header: `Bearer {token}`
2. Test each endpoint
3. Verify error responses
4. Check data validation

## Performance Tips

1. **Lazy Load Components:**
   ```javascript
   const Component = lazy(() => import('./Component'));
   ```

2. **Memoize Components:**
   ```javascript
   export default memo(Component);
   ```

3. **Optimize Queries:**
   - Use `.select()` to limit fields
   - Use `.limit()` for pagination
   - Add proper indexes

4. **Cache Data:**
   - Store in localStorage for non-sensitive data
   - Use React Query for API caching

## Debugging

### Browser DevTools
- React DevTools extension
- Network tab for API calls
- Console for errors
- Application tab for localStorage

### Backend Debugging
- Console.log for debugging
- Use Postman for API testing
- Check MongoDB directly
- Review server logs

## Deployment

### Backend
```bash
npm install
npm start
```

### Frontend
```bash
npm install
npm run build
npm run preview
```

## Environment Setup

### Backend .env
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/grievance-portal
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### Frontend .env
```
VITE_API_URL=http://localhost:5000/api
```

## Useful Commands

```bash
# Backend
npm install              # Install dependencies
npm start               # Start server
npm run dev             # Start with nodemon

# Frontend
npm install             # Install dependencies
npm run dev             # Start dev server
npm run build           # Build for production
npm run preview         # Preview build
npm run lint            # Run ESLint
```

## Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Express.js](https://expressjs.com)
- [MongoDB](https://www.mongodb.com)
- [Axios](https://axios-http.com)
- [Recharts](https://recharts.org)

## Support

For issues or questions:
1. Check existing documentation
2. Review similar implementations
3. Check browser console for errors
4. Review server logs
5. Test with Postman

---

**Last Updated:** 2024
**Version:** 1.0
