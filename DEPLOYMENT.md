# Deployment Guide

## 🚀 Production Deployment

### Prerequisites for Production

- [ ] Domain name (optional but recommended)
- [ ] SSL certificate (Let's Encrypt or similar)
- [ ] Production Google Cloud project
- [ ] Production WhatsApp Business API account
- [ ] Strong admin password and JWT secret

---

## Backend Deployment

### Option 1: Heroku

#### 1. Install Heroku CLI
```bash
npm install -g heroku
```

#### 2. Login and Create App
```bash
heroku login
heroku create your-app-name
```

#### 3. Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set PORT=5000
heroku config:set ADMIN_EMAIL=admin@example.com
heroku config:set ADMIN_PASSWORD=your_secure_password
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set GOOGLE_SHEETS_CLIENT_EMAIL=your-service@project.iam.gserviceaccount.com
heroku config:set GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
heroku config:set GOOGLE_SHEET_ID=your_sheet_id
heroku config:set WHATSAPP_API_TOKEN=your_token
heroku config:set WHATSAPP_PHONE_NUMBER_ID=your_phone_id
heroku config:set WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_id
```

#### 4. Create Procfile
```bash
echo "web: cd backend && npm start" > Procfile
```

#### 5. Deploy
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

#### 6. Open App
```bash
heroku open
```

---

### Option 2: DigitalOcean App Platform

#### 1. Create Account
Sign up at [DigitalOcean](https://www.digitalocean.com/)

#### 2. Create New App
- Connect your GitHub repository
- Select the repository and branch

#### 3. Configure Build Settings
- **Build Command:** `cd backend && npm install`
- **Run Command:** `cd backend && npm start`
- **HTTP Port:** 5000

#### 4. Add Environment Variables
Add all variables from `.env` in the App Platform dashboard

#### 5. Deploy
Click "Deploy" and wait for build to complete

---

### Option 3: AWS EC2

#### 1. Launch EC2 Instance
- Choose Ubuntu 22.04 LTS
- t2.micro (free tier eligible)
- Configure security group (port 5000, 80, 443)

#### 2. Connect to Instance
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

#### 3. Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
```

#### 4. Clone Repository
```bash
git clone your-repo-url
cd whatsapp_automation/backend
npm install
```

#### 5. Create .env File
```bash
nano .env
# Paste your environment variables
```

#### 6. Start with PM2
```bash
pm2 start server.js --name whatsapp-backend
pm2 save
pm2 startup
```

#### 7. Setup Nginx (optional)
```bash
sudo apt-get install nginx
sudo nano /etc/nginx/sites-available/default
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo systemctl restart nginx
```

---

### Option 4: Railway

#### 1. Sign Up
Go to [Railway.app](https://railway.app/)

#### 2. New Project
- Click "New Project"
- Select "Deploy from GitHub repo"
- Connect your repository

#### 3. Configure
- Add environment variables in Railway dashboard
- Railway auto-detects Node.js

#### 4. Deploy
Railway automatically deploys on git push

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Build Frontend
```bash
cd frontend
npm run build
```

#### 3. Deploy
```bash
vercel --prod
```

#### 4. Configure Environment
Create `frontend/.env.production`:
```env
VITE_API_URL=https://your-backend-url.com/api
```

Update `frontend/src/api/axios.js`:
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  // ...
});
```

#### 5. Redeploy
```bash
npm run build
vercel --prod
```

---

### Option 2: Netlify

#### 1. Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### 2. Build and Deploy
```bash
cd frontend
npm run build
netlify deploy --prod --dir=dist
```

#### 3. Configure Redirects
Create `frontend/public/_redirects`:
```
/api/* https://your-backend-url.com/api/:splat 200
/* /index.html 200
```

---

### Option 3: GitHub Pages

#### 1. Install gh-pages
```bash
cd frontend
npm install --save-dev gh-pages
```

#### 2. Update package.json
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://yourusername.github.io/whatsapp-automation"
}
```

#### 3. Deploy
```bash
npm run deploy
```

---

## Security Checklist for Production

### Environment Variables
- [ ] Change `ADMIN_PASSWORD` to a strong password
- [ ] Generate random `JWT_SECRET` (at least 32 characters)
- [ ] Use production WhatsApp API credentials
- [ ] Use production Google Cloud project

### Code Security
- [ ] Enable HTTPS/SSL
- [ ] Update CORS settings to allow only your domain
- [ ] Set `NODE_ENV=production`
- [ ] Enable rate limiting
- [ ] Add request logging
- [ ] Implement error tracking (Sentry, etc.)

### Infrastructure
- [ ] Use environment variables (never hardcode secrets)
- [ ] Enable firewall rules
- [ ] Regular security updates
- [ ] Database backups (Google Sheets auto-saves)
- [ ] Monitor server resources

---

## CORS Configuration for Production

Update `backend/server.js`:

```javascript
// Development
if (config.nodeEnv === 'development') {
  app.use(cors());
} else {
  // Production
  app.use(cors({
    origin: [
      'https://your-frontend-domain.com',
      'https://www.your-frontend-domain.com'
    ],
    credentials: true,
  }));
}
```

---

## Environment-Specific Configurations

### Development
```env
NODE_ENV=development
PORT=5000
# Use test/sandbox APIs
```

### Staging
```env
NODE_ENV=staging
PORT=5000
# Use test/sandbox APIs
```

### Production
```env
NODE_ENV=production
PORT=5000
# Use production APIs
```

---

## Monitoring and Logging

### Option 1: PM2 Monitoring (AWS/VPS)
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Option 2: Application Monitoring
- **New Relic:** Full-stack monitoring
- **DataDog:** Infrastructure and application monitoring
- **Sentry:** Error tracking

### Option 3: Log Management
- **Loggly:** Cloud-based log management
- **Papertrail:** Simple log management
- **CloudWatch:** AWS native logging

---

## Backup Strategy

### Google Sheets
- Google Sheets automatically saves and versions
- Consider exporting backups periodically
- Use Google Sheets API to create automated backups

### Application Logs
- Use log rotation (PM2, logrotate)
- Store logs for at least 30 days
- Consider cloud storage for long-term logs

---

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (AWS ALB, Nginx)
- Multiple backend instances
- Shared session storage (Redis)

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Implement caching (Redis)

### Performance Optimization
- Enable gzip compression
- Use CDN for frontend assets
- Implement request caching
- Optimize scheduler intervals

---

## SSL/HTTPS Setup

### Let's Encrypt (Free SSL)

#### With Certbot (Linux)
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

#### Auto-renewal
```bash
sudo certbot renew --dry-run
```

### CloudFlare (Free SSL + CDN)
1. Sign up at [CloudFlare](https://www.cloudflare.com/)
2. Add your domain
3. Update nameservers
4. Enable SSL (Full or Flexible)

---

## Health Checks and Uptime Monitoring

### Services
- **UptimeRobot:** Free uptime monitoring
- **Pingdom:** Advanced monitoring
- **StatusCake:** Free tier available

### Setup Health Check Endpoint
Already included: `GET /api/health`

Configure monitoring to ping this endpoint every 5 minutes.

---

## Continuous Deployment (CI/CD)

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy Backend
        run: |
          # Your deployment script
          
      - name: Deploy Frontend
        run: |
          cd frontend
          npm install
          npm run build
          # Deploy to Vercel/Netlify
```

---

## Troubleshooting Production Issues

### Backend Not Starting
1. Check environment variables
2. Review server logs
3. Verify Node.js version
4. Check port availability

### Messages Not Sending
1. Verify WhatsApp API token is valid
2. Check phone number formats
3. Review scheduler logs
4. Confirm Google Sheets access

### High Memory Usage
1. Review scheduler intervals
2. Check for memory leaks
3. Implement log rotation
4. Optimize data processing

---

## Production Checklist

Before going live:
- [ ] Test all features thoroughly
- [ ] Verify all environment variables
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up monitoring and alerts
- [ ] Configure backups
- [ ] Update documentation
- [ ] Test WhatsApp message delivery
- [ ] Verify Google Sheets integration
- [ ] Load test the application
- [ ] Set up error tracking
- [ ] Configure rate limiting
- [ ] Review security settings

---

## Cost Estimates

### Backend (Monthly)
- **Heroku:** $7 (Hobby tier)
- **DigitalOcean:** $5 (Basic Droplet)
- **AWS EC2:** $5-10 (t2.micro)
- **Railway:** $5 (Starter)

### Frontend (Monthly)
- **Vercel:** Free (Hobby) or $20 (Pro)
- **Netlify:** Free (Starter) or $19 (Pro)
- **GitHub Pages:** Free

### APIs (Monthly)
- **Google Sheets API:** Free (up to quota)
- **WhatsApp Cloud API:** Free tier available

**Total Estimated Cost:** $5-30/month

---

## Support and Maintenance

### Regular Maintenance Tasks
- [ ] Update dependencies monthly
- [ ] Review and rotate access tokens
- [ ] Check server logs weekly
- [ ] Monitor message delivery rates
- [ ] Review failed messages
- [ ] Backup Google Sheets data
- [ ] Check server resource usage

---

**Need Help with Deployment?**
Contact your system administrator or DevOps team for assistance.

**Last Updated:** December 2025
