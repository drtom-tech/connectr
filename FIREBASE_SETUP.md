# Firebase Setup Guide for Connectr

## Prerequisites
1. A Google account
2. Access to the Firebase Console

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `connectr-mvp` (or your preferred name)
4. Choose whether to enable Google Analytics (optional for MVP)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Click "Save"

## Step 3: Create Firestore Database

1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database (choose closest to your users)
5. Click "Done"

## Step 4: Get Firebase Configuration

1. Go to Project Settings (gear icon next to "Project Overview")
2. Scroll down to "Your apps" section
3. Click "Add app" and select the web icon (</>)
4. Register your app with a nickname (e.g., "Connectr Web App")
5. Copy the Firebase configuration object

## Step 5: Update Firebase Configuration

1. Open `src/api/firebase.ts` in your Connectr project
2. Replace the placeholder configuration with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "connectr-mvp.firebaseapp.com", // Replace with your project ID
  projectId: "connectr-mvp", // Replace with your project ID
  storageBucket: "connectr-mvp.appspot.com", // Replace with your project ID
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};
```

## Step 6: Set Up Firestore Security Rules

1. Go to "Firestore Database" → "Rules" tab
2. Replace the default rules with these (for development):

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

## Step 7: Test the Setup

1. Run your app: `npm start`
2. Try creating an account and signing in
3. Create an event to test Firestore integration

## Security Notes

- The security rules above allow users to only access their own data
- For production, consider more restrictive rules
- Never commit your Firebase config with real API keys to version control
- Use environment variables for production deployments

## Troubleshooting

### Common Issues:
1. **Authentication not working**: Check if Email/Password is enabled in Firebase Console
2. **Firestore permission denied**: Verify your security rules
3. **Network errors**: Check your internet connection and Firebase project status
4. **App crashes**: Check the Metro bundler logs for detailed error messages

### Getting Help:
- Check the [Firebase Documentation](https://firebase.google.com/docs)
- Review the [React Native Firebase docs](https://rnfirebase.io/)
- Check the Expo documentation for Firebase integration


