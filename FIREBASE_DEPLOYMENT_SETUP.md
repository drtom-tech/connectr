# Firebase Deployment Setup for Connectr

## The Problem
Your authentication isn't working because the Firebase configuration is using placeholder values instead of your actual Firebase project credentials.

## Solution Steps

### 1. Set up Firebase Project (if not done already)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one named `connectr-mvp`
3. Enable **Email/Password Authentication**:
   - Go to Authentication → Sign-in method
   - Enable "Email/Password"
4. Create **Firestore Database**:
   - Go to Firestore Database → Create database
   - Start in test mode
5. Get your **Firebase Configuration**:
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps" section
   - Add web app if not already added
   - Copy the config object

### 2. Configure Environment Variables in Netlify

**Option A: Through Netlify Dashboard (Recommended)**
1. Go to your Netlify site dashboard
2. Go to **Site settings** → **Environment variables**
3. Add these variables with your actual Firebase values:

```
REACT_APP_FIREBASE_API_KEY = your-actual-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN = your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID = your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET = your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID = your-actual-sender-id
REACT_APP_FIREBASE_APP_ID = your-actual-app-id
```

**Option B: Through netlify.toml (Less Secure)**
1. Uncomment and fill in the environment variables in `netlify.toml`
2. Replace the placeholder values with your actual Firebase config

### 3. Set up Firestore Security Rules

Go to Firestore Database → Rules and use these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own data
    match /events/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /people/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /attendance/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /relationships/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### 4. Redeploy

After setting up the environment variables:
1. Go to your Netlify dashboard
2. Click "Trigger deploy" → "Deploy site"
3. Or push a new commit to trigger automatic deployment

### 5. Test Authentication

1. Visit your deployed site
2. Try creating a new account
3. Try signing in with the created account

## Security Notes

- **Never commit real Firebase credentials to your repository**
- Use environment variables for all sensitive configuration
- The current setup uses placeholder values as fallbacks for development

## Troubleshooting

### Still can't authenticate?
1. Check browser console for Firebase errors
2. Verify environment variables are set correctly in Netlify
3. Ensure Email/Password authentication is enabled in Firebase Console
4. Check Firestore security rules

### Getting "Permission denied" errors?
- Verify your Firestore security rules
- Make sure the user is authenticated before accessing data

### Environment variables not working?
- Make sure variable names start with `REACT_APP_`
- Redeploy after adding environment variables
- Check Netlify build logs for any errors
