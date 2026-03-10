# Deployment Guide

## 🚀 Deploying to Production

This guide covers deployment to various platforms.

---

## 📋 Pre-Deployment Checklist

- [ ] Update API base URL in `.env`
- [ ] Add Google Maps API key (if using maps)
- [ ] Test production build locally
- [ ] Update meta tags in `index.html`
- [ ] Configure CORS on backend
- [ ] Set up SSL certificate
- [ ] Configure environment variables
- [ ] Test all user flows
- [ ] Check responsive design
- [ ] Verify API endpoints

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

**Why Vercel?**
- Zero configuration
- Automatic HTTPS
- Global CDN
- Free tier available
- Perfect for Vite/React

**Steps:**

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
cd frontend
vercel
```

4. Set environment variables in Vercel dashboard:
   - `VITE_API_BASE_URL`
   - `VITE_GOOGLE_MAPS_API_KEY`

5. Deploy to production:
```bash
vercel --prod
```

**Configuration File** (`vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

### Option 2: Netlify

**Steps:**

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login:
```bash
netlify login
```

3. Initialize:
```bash
netlify init
```

4. Deploy:
```bash
netlify deploy --prod
```

**Configuration File** (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

---

### Option 3: AWS S3 + CloudFront

**Steps:**

1. Build the project:
```bash
npm run build
```

2. Create S3 bucket:
```bash
aws s3 mb s3://your-bucket-name
```

3. Configure bucket for static hosting:
```bash
aws s3 website s3://your-bucket-name --index-document index.html --error-document index.html
```

4. Upload files:
```bash
aws s3 sync dist/ s3://your-bucket-name
```

5. Set up CloudFront distribution for CDN and HTTPS

6. Configure Route 53 for custom domain

---

### Option 4: Traditional Web Server (Nginx)

**Nginx Configuration:**

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/grievance-portal/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Steps:**

1. Build the project:
```bash
npm run build
```

2. Copy dist folder to server:
```bash
scp -r dist/* user@server:/var/www/grievance-portal/dist/
```

3. Configure Nginx (see above)

4. Restart Nginx:
```bash
sudo systemctl restart nginx
```

---

### Option 5: Docker

**Dockerfile:**

```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**
```nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

**Build and Run:**
```bash
docker build -t grievance-portal .
docker run -p 80:80 grievance-portal
```

---

## 🔐 Environment Variables

Create `.env.production`:

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_GOOGLE_MAPS_API_KEY=your_production_api_key
VITE_ENV=production
```

**Important:** Never commit `.env` files to Git!

---

## 🔒 Security Considerations

### 1. HTTPS
- Always use HTTPS in production
- Use Let's Encrypt for free SSL certificates
- Configure HSTS headers

### 2. API Security
- Use CORS properly
- Implement rate limiting
- Validate all inputs
- Use secure headers

### 3. Environment Variables
- Never expose sensitive keys in frontend
- Use backend proxy for sensitive operations
- Rotate API keys regularly

### 4. Content Security Policy
Add to `index.html`:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:;">
```

---

## 📊 Performance Optimization

### 1. Build Optimization
```bash
# Analyze bundle size
npm run build -- --mode production

# Use Vite's built-in optimizations
# Already configured in vite.config.js
```

### 2. CDN Configuration
- Use CloudFront or Cloudflare
- Enable gzip/brotli compression
- Set proper cache headers
- Use HTTP/2

### 3. Image Optimization
- Compress images before upload
- Use WebP format
- Implement lazy loading
- Use responsive images

### 4. Code Splitting
```javascript
// Lazy load routes
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
```

---

## 🔍 Monitoring & Analytics

### 1. Error Tracking
Install Sentry:
```bash
npm install @sentry/react
```

Configure in `main.jsx`:
```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
});
```

### 2. Analytics
Add Google Analytics to `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 3. Performance Monitoring
- Use Lighthouse CI
- Monitor Core Web Vitals
- Set up uptime monitoring
- Track API response times

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: |
        cd frontend
        npm ci
    
    - name: Build
      run: |
        cd frontend
        npm run build
      env:
        VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
        VITE_GOOGLE_MAPS_API_KEY: ${{ secrets.MAPS_API_KEY }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        working-directory: ./frontend
```

---

## 🧪 Testing Before Deployment

### 1. Local Production Build
```bash
npm run build
npm run preview
```

### 2. Test Checklist
- [ ] All routes work
- [ ] Authentication flow
- [ ] API calls succeed
- [ ] Forms submit correctly
- [ ] Images load
- [ ] Charts render
- [ ] Mobile responsive
- [ ] Cross-browser testing

### 3. Lighthouse Audit
```bash
npm install -g lighthouse
lighthouse http://localhost:4173 --view
```

Target scores:
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

---

## 📱 Progressive Web App (Optional)

### 1. Add Service Worker
Create `public/sw.js`:
```javascript
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/assets/index.css',
        '/assets/index.js',
      ]);
    })
  );
});
```

### 2. Register Service Worker
In `main.jsx`:
```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

### 3. Add Web Manifest
Create `public/manifest.json`:
```json
{
  "name": "Grievance Portal",
  "short_name": "Grievance",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 🔧 Troubleshooting

### Issue: Routes not working after deployment
**Solution:** Configure server to redirect all routes to index.html

### Issue: Environment variables not working
**Solution:** Ensure variables start with `VITE_` prefix

### Issue: API calls failing
**Solution:** Check CORS configuration on backend

### Issue: Build size too large
**Solution:** Analyze bundle and implement code splitting

---

## 📞 Post-Deployment

1. **Monitor Logs**
   - Check error logs
   - Monitor API calls
   - Track user behavior

2. **Set Up Alerts**
   - Uptime monitoring
   - Error rate alerts
   - Performance degradation

3. **Regular Updates**
   - Security patches
   - Dependency updates
   - Feature releases

4. **Backup Strategy**
   - Database backups
   - Code repository
   - Configuration files

---

## 🎯 Production Checklist

- [ ] Build succeeds without errors
- [ ] All environment variables set
- [ ] HTTPS configured
- [ ] Custom domain configured
- [ ] Analytics installed
- [ ] Error tracking setup
- [ ] Performance optimized
- [ ] SEO meta tags added
- [ ] Favicon added
- [ ] 404 page works
- [ ] All routes accessible
- [ ] Mobile responsive
- [ ] Cross-browser tested
- [ ] API endpoints correct
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Monitoring setup
- [ ] Backup strategy in place

---

## 📚 Additional Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Deployment](https://react.dev/learn/start-a-new-react-project#deploying-to-production)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [AWS S3 Static Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)

---

**Ready to deploy! 🚀**
