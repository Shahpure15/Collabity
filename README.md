# Collabity - Student Collaboration Platform

A modern full-stack platform for college students to discover, connect, and collaborate on projects, hackathons, and learning opportunities.

## 🚀 Features

### Authentication
- ✅ Email/Password authentication
- ✅ Google OAuth sign-in
- ✅ Passwordless email link authentication
- ✅ Password reset functionality
- ✅ User profile management in Firestore

### User Management
- ✅ User profiles with skills, interests, and availability
- ✅ User discovery and search
- ✅ Filter users by college, skills, and availability
- ✅ Real-time profile updates

### Pages
- Landing page
- Login/Register pages
- Dashboard
- User discovery page
- Passwordless authentication flow

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for build tooling
- **TailwindCSS** for styling
- **Radix UI** for components
- **Firebase** for authentication
- **Firestore** for database
- **TanStack Query** for data management
- **React Router** for routing

### Backend
- **Next.js 16** (App Router)
- **Firebase Admin SDK** for auth verification
- **TypeScript**

## 📦 Setup Instructions

### Prerequisites
- Node.js 18+
- Firebase project

### Frontend Setup

1. **Install dependencies:**
```bash
cd frontend
npm install
```

2. **Configure environment variables:**

Create `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:3000

# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

3. **Start development server:**
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

### Backend Setup

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Configure Firebase Admin:**

Download your Firebase service account key from:
https://console.firebase.google.com/project/YOUR_PROJECT/settings/serviceaccounts/adminsdk

Save as `backend/serviceAccountKey.json`

3. **Configure environment variables:**

Create `backend/.env`:
```env
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
NEXT_PUBLIC_FRONTEND_URL=http://localhost:5173
```

4. **Start development server:**
```bash
npm run dev
```

Backend runs on `http://localhost:3000`

## 🔥 Firebase Configuration

### 1. Enable Authentication Methods

In Firebase Console → Authentication → Sign-in method:
- ✅ Email/Password
- ✅ Google
- ✅ Email link (passwordless sign-in)

### 2. Create Firestore Database

In Firebase Console → Firestore Database:
1. Create database
2. Start in **test mode** (for development)
3. Set rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 3. Add Authorized Domains

In Firebase Console → Authentication → Settings → Authorized domains:
- Add your production domain
- `localhost` is already authorized for development

## 📱 Usage

1. **Register an account** at `/auth/register`
2. **Sign in** with email/password, Google, or email link
3. **Complete your profile** on the dashboard
4. **Discover other students** at `/discover`
5. **Search and filter** by skills, college, availability

## 🔐 Security

- Firebase Authentication handles user authentication
- Backend verifies all requests with Firebase Admin SDK
- Firestore rules protect user data
- HTTPS required in production

## 📂 Project Structure

```
frontend/
├── src/
│   ├── app/              # App setup (router, providers)
│   ├── components/       # Reusable UI components
│   ├── features/         # Feature modules
│   │   ├── auth/         # Authentication
│   │   ├── dashboard/    # User dashboard
│   │   └── discover/     # User discovery
│   └── lib/              # Utilities & services
└── public/

backend/
├── src/
│   ├── app/
│   │   └── api/          # API routes
│   │       ├── auth/     # Auth endpoints
│   │       └── health/   # Health check
│   └── lib/              # Backend utilities
└── serviceAccountKey.json (create this)
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy `dist` folder
3. Set environment variables

### Backend (Vercel)
1. Deploy Next.js app
2. Set Firebase service account as environment variables
3. Configure CORS for your frontend domain

## 📝 API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/verify` - Verify Firebase token
- `GET /api/auth/me` - Get current user (authenticated)

## 🤝 Contributing

This is a college project. Feel free to fork and customize!

## 📄 License

MIT License
