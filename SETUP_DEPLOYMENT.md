# Setup & Deployment Guide

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn
- Git

## Local Development Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd "Grievance Management Portal"
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/grievance-portal
JWT_SECRET=your_super_secret_key_change_this
NODE_ENV=development
EOF

# Start MongoDB (if local)
# On Windows: mongod
# On Mac: brew services start mongodb-community
# On Linux: sudo systemctl start mongod

# Start backend server
npm start
# Server runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (if needed)
cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
EOF

# Start development server
npm run dev
# Frontend runs on http://localhost:5173
```

### 4. Access Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health

## Default Test Accounts

### Admin
- Email: `admin@example.com`
- Password: `admin123`

### Officer
- Email: `officer@example.com`
- Password: `officer123`

### Citizen
- Email: `citizen@example.com`
- Password: `citizen123`

## Database Setup

### MongoDB Local Setup

**Windows:**
```bash
# Download from https://www.mongodb.com/try/download/community
# Run installer and follow prompts
# Start MongoDB:
mongod
```

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongod
```

### MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create account and cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/grievance-portal
```

## Project Structure

```
Grievance Management Portal/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── uploads/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

## Running Tests

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Building for Production

### Backend Build
```bash
cd backend
npm run build
# or just use npm start for production
```

### Frontend Build
```bash
cd frontend
npm run build
# Output in dist/ folder
```

## Deployment Options

### Option 1: Heroku

**Backend:**
```bash
cd backend
heroku login
heroku create your-app-name
git push heroku main
```

**Frontend:**
```bash
cd frontend
npm run build
# Deploy dist/ folder to Netlify or Vercel
```

### Option 2: AWS

**Backend (EC2):**
1. Launch EC2 instance
2. Install Node.js and MongoDB
3. Clone repository
4. Set environment variables
5. Start application with PM2

```bash
npm install -g pm2
pm2 start server.js --name "grievance-api"
pm2 startup
pm2 save
```

**Frontend (S3 + CloudFront):**
1. Build frontend: `npm run build`
2. Upload `dist/` to S3
3. Create CloudFront distribution
4. Point domain to CloudFront

### Option 3: Docker

**Dockerfile (Backend):**
```dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

**Build and Run:**
```bash
docker build -t grievance-api .
docker run -p 5000:5000 -e MONGODB_URI=mongodb://... grievance-api
```

### Option 4: DigitalOcean

1. Create Droplet (Ubuntu 20.04)
2. SSH into droplet
3. Install Node.js, MongoDB, Nginx
4. Clone repository
5. Configure Nginx as reverse proxy
6. Use Let's Encrypt for SSL

## Environment Variables

### Backend (.env)
```
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db

# Authentication
JWT_SECRET=your_very_secret_key_min_32_chars

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

### Frontend (.env)
```
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=Grievance Portal
```

## Performance Optimization

### Backend
1. Enable compression
2. Use caching headers
3. Implement rate limiting
4. Use database indexes
5. Optimize queries

### Frontend
1. Code splitting
2. Lazy loading
3. Image optimization
4. Minification
5. Caching strategies

## Security Checklist

- [ ] Change JWT_SECRET
- [ ] Enable HTTPS
- [ ] Set CORS properly
- [ ] Validate all inputs
- [ ] Use environment variables
- [ ] Enable rate limiting
- [ ] Set secure headers
- [ ] Use HTTPS for database
- [ ] Regular backups
- [ ] Monitor logs

## Monitoring & Logging

### Backend Logging
```javascript
const logger = require('winston');
logger.info('Application started');
logger.error('Error occurred', error);
```

### Frontend Error Tracking
```javascript
// Use Sentry or similar
import * as Sentry from "@sentry/react";
Sentry.init({ dsn: "your-dsn" });
```

## Backup & Recovery

### MongoDB Backup
```bash
# Backup
mongodump --uri "mongodb://localhost:27017/grievance-portal" --out ./backup

# Restore
mongorestore --uri "mongodb://localhost:27017/grievance-portal" ./backup
```

### Automated Backups
```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri "$MONGODB_URI" --out ./backups/backup_$DATE
```

## Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Find process using port 5000
lsof -i :5000
# Kill process
kill -9 <PID>
```

**MongoDB connection error:**
- Check MongoDB is running
- Verify connection string
- Check firewall rules
- Verify credentials

**CORS errors:**
- Check CORS configuration
- Verify frontend URL in backend
- Check browser console

### Frontend Issues

**API not responding:**
- Check backend is running
- Verify API URL in .env
- Check network tab in DevTools
- Check CORS headers

**Build errors:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`
- Check Node version

## Maintenance

### Regular Tasks
- Monitor server logs
- Check database size
- Review error rates
- Update dependencies
- Backup data
- Security patches

### Update Dependencies
```bash
# Check outdated packages
npm outdated

# Update packages
npm update

# Update specific package
npm install package@latest
```

## Support & Documentation

- **API Documentation:** `/api/docs` (if Swagger enabled)
- **Frontend Docs:** See `DEVELOPER_GUIDE.md`
- **Implementation:** See `IMPLEMENTATION_SUMMARY.md`

## Useful Links

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/)

## Contact & Support

For issues or questions:
1. Check documentation
2. Review error logs
3. Check GitHub issues
4. Contact development team

---

**Last Updated:** 2024
**Version:** 1.0
**Status:** Production Ready
