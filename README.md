# BarterTalk

Real-time chat application with Google OAuth authentication

## 🚀 Features
- Real-time messaging with Socket.io
- Google OAuth 2.0 authentication
- Video calling functionality
- User profiles and avatars
- Responsive design

## 🛠️ Technologies
- **Frontend**: React, Vite, TailwindCSS, DaisyUI
- **Backend**: Node.js, Express, MongoDB
- **Real-time**: Socket.io
- **State Management**: Zustand
- **Authentication**: JWT, Google OAuth2

## 📋 Prerequisites
- Node.js (v16+)
- MongoDB
- Google OAuth Client ID ([Get it here](https://console.cloud.google.com/apis/credentials))

## 🔧 Setup

### Backend
```bash
# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your values

# Start server
npm start
```

### Frontend
```bash
cd Frontend

# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your values

# Start development server
npm run dev
```

## 🌍 Environment Variables

### Backend (.env)
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_secret_key_32_chars_minimum
REACT_APP_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_APP_GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_URL=http://localhost:3000/api
```

See `.env.example` files for complete configuration.

## 🚀 Production Deployment

For production deployment, follow the comprehensive guide:
- **Step-by-step checklist**: See `DEPLOYMENT_CHECKLIST.md`
- **Google OAuth setup**: See `GOOGLE_OAUTH_FIX_SUMMARY.md`
- **Troubleshooting**: See `GOOGLE_LOGIN_PRODUCTION_FIX.md`

### Quick Test
Test CORS configuration for production:
```bash
./test-cors.sh https://your-frontend.com https://your-backend.com
```

## 📚 Documentation
- [Deployment Checklist](DEPLOYMENT_CHECKLIST.md) - Complete deployment guide
- [Google OAuth Fix](GOOGLE_OAUTH_FIX_SUMMARY.md) - OAuth setup and troubleshooting
- [Production Fix Guide](GOOGLE_LOGIN_PRODUCTION_FIX.md) - Detailed debugging guide

## 🐛 Common Issues
- **Google login not working in production?** → See `GOOGLE_LOGIN_PRODUCTION_FIX.md`
- **CORS errors?** → Run `./test-cors.sh` and check environment variables
- **Authentication failing?** → Verify JWT secret and token configuration

## 📝 License
This project is licensed under the Apache License 2.0 - see LICENSE file for details

