# Collabity Backend Setup Guide

This guide will help you set up the backend with Firebase Admin SDK for authentication.

## Prerequisites

- Node.js (v18 or higher)
- A Firebase project
- Firebase service account credentials

## Step 1: Install Dependencies

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

## Step 2: Set Up Firebase Service Account

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** (gear icon) → **Service Accounts**
4. Click **Generate New Private Key**
5. Save the downloaded JSON file as `serviceAccountKey.json` in the `backend` directory

⚠️ **IMPORTANT**: Never commit `serviceAccountKey.json` to version control! It's already in `.gitignore`.

## Step 3: Configure Environment Variables

The backend needs Firebase credentials to authenticate users. Update the `.env` file:

```bash
# Option 1: Use service account file (recommended for local development)
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json

# Option 2: Use environment variables (recommended for production)
# Uncomment and fill these if not using the JSON file:
# FIREBASE_PROJECT_ID=your-project-id
# FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
# FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com

# Frontend URL for CORS
NEXT_PUBLIC_FRONTEND_URL=http://localhost:5173
```

## Step 4: Start the Backend

```bash
npm run dev
```

The backend will start on `http://localhost:3000`

## Step 5: Test the Backend

### Test Health Check
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-04T...",
  "message": "Backend is running"
}
```

## API Endpoints

### Public Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/verify` - Verify Firebase ID token

### Protected Endpoints

All protected endpoints require an `Authorization` header with a Firebase ID token:

```
Authorization: Bearer <firebase-id-token>
```

- `GET /api/auth/me` - Get current user information

## Frontend Integration

The frontend is already configured to:
1. Authenticate users with Firebase
2. Send Firebase ID tokens to the backend
3. Verify tokens with the backend after successful login

Make sure the frontend `.env` file includes:
```
VITE_API_BASE_URL=http://localhost:3000
```

## Troubleshooting

### Firebase Admin Initialization Error

**Error**: "Firebase Admin SDK credentials not found"

**Solution**: Make sure either:
- `serviceAccountKey.json` exists in the backend directory, OR
- Environment variables are properly set in `.env`

### Token Verification Failed

**Error**: "Invalid token" or 401 Unauthorized

**Solution**:
- Ensure the frontend and backend are using the same Firebase project
- Check that the Firebase ID token is being sent in the Authorization header
- Verify the service account has the correct permissions

### CORS Issues

**Error**: CORS policy blocking requests

**Solution**: 
- Make sure `NEXT_PUBLIC_FRONTEND_URL` in `.env` matches your frontend URL
- Next.js handles CORS automatically for API routes

## Project Structure

```
backend/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── verify/route.ts    # Verify Firebase token
│   │   │   │   └── me/route.ts        # Get user info
│   │   │   └── health/route.ts        # Health check
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── lib/
│   │   └── firebase-admin.ts          # Firebase Admin SDK utilities
│   └── middleware.ts                   # Authentication middleware
├── .env                                # Environment variables (create this)
├── .env.example                        # Environment variables template
├── serviceAccountKey.json             # Firebase service account (create this)
└── package.json
```

## Security Notes

1. **Never commit** `serviceAccountKey.json` or `.env` files to version control
2. **Use environment variables** in production (Option 2 in Step 3)
3. **Rotate service account keys** periodically
4. **Limit service account permissions** to only what's needed
5. **Enable HTTPS** in production

## Next Steps

Once the backend is running and you can successfully log in:

1. ✅ Users can register and log in via Firebase
2. ✅ Frontend sends Firebase ID tokens to backend
3. ✅ Backend verifies tokens and returns user info
4. 🚀 Build additional API endpoints for your app features

## Support

If you encounter any issues:
1. Check the console logs in both frontend and backend
2. Verify all environment variables are set correctly
3. Ensure Firebase project settings are correct
4. Check that dependencies are installed (`npm install`)
