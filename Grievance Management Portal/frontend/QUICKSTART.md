# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open Browser
Navigate to: `http://localhost:5173`

## 🎯 Test the Application

### Login Credentials (Mock)

**As Citizen:**
```
Email: citizen@example.com
Password: password123
```

**As Officer:**
```
Email: officer@example.com
Password: password123
```

**As Admin:**
```
Email: admin@example.com
Password: password123
```

## 📋 Quick Feature Tour

### Citizen Flow
1. Login as citizen
2. Click "Submit Complaint"
3. Fill form with complaint details
4. Select location (use GPS button)
5. Upload images (optional)
6. Submit and view in "My Complaints"

### Officer Flow
1. Login as officer
2. View assigned complaints in dashboard
3. Click on a complaint
4. Update status and add remarks
5. Track progress

### Admin Flow
1. Login as admin
2. View system-wide dashboard
3. Manage departments and officers
4. Assign complaints to departments
5. View analytics and heatmap

## 🛠️ Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 📁 Key Files to Know

```
src/
├── App.jsx              # Main routing configuration
├── context/
│   └── AuthContext.jsx  # Authentication state
├── services/
│   └── api.js          # API endpoints
├── components/         # Reusable components
├── pages/             # Page components
└── layouts/           # Layout wrappers
```

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#your-color',
    600: '#your-darker-color',
  }
}
```

### Change API URL
Edit `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://your-api-url';
```

### Add New Route
Edit `src/App.jsx`:
```javascript
<Route path="/new-route" element={<YourComponent />} />
```

## 🐛 Common Issues

**Port already in use?**
```bash
# Kill process on port 5173
npx kill-port 5173
```

**Dependencies not installing?**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Tailwind styles not working?**
```bash
# Restart dev server
# Press Ctrl+C and run npm run dev again
```

## 📚 Next Steps

1. Read full [README.md](./README.md)
2. Check [DOCUMENTATION.md](./DOCUMENTATION.md) for technical details
3. Explore component files in `src/components/`
4. Customize for your needs

## 💡 Tips

- Use React DevTools browser extension for debugging
- Check browser console for errors
- Use Network tab to inspect API calls
- Tailwind IntelliSense extension for VS Code is helpful

## 🤝 Need Help?

- Check documentation files
- Review component code
- Open an issue on GitHub
- Contact support team

Happy coding! 🎉
