# Connectr - Event & Relationship Tracker MVP

A cross-platform mobile app built with React Native (Expo) that allows users to track events, attendees, and social relationships.

## Features

- **User Authentication**: Email/password sign up and sign in
- **Event Management**: Create and manage events with details like name, date, location, and description
- **People Management**: Track people with contact information and notes
- **Attendance Tracking**: Link people to events (many-to-many relationship)
- **Relationship Mapping**: Track relationships between people (one-to-many/many-to-many)
- **Timeline View**: Chronological view of all events
- **Person Profiles**: Detailed views of people with their event history and relationships

## Tech Stack

- **Frontend**: React Native with Expo
- **Language**: TypeScript
- **Backend**: Firebase (Firestore + Authentication)
- **Navigation**: React Navigation
- **Styling**: React Native StyleSheet

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (optional, can use npx)
- Firebase project (see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md))

## Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <your-repo-url>
   cd Connectr
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Firebase**:
   - Follow the instructions in [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
   - Update the Firebase configuration in `src/api/firebase.ts`

4. **Start the development server**:
   ```bash
   npm start
   ```

5. **Run on device/simulator**:
   - Scan the QR code with Expo Go app on your phone
   - Or press `i` for iOS simulator / `a` for Android emulator
   - Or press `w` to run in web browser

## Project Structure

```
Connectr/
├── src/
│   ├── api/
│   │   └── firebase.ts          # Firebase configuration and API functions
│   ├── navigation/
│   │   └── AppNavigator.tsx     # Navigation setup
│   ├── screens/
│   │   ├── AuthScreen.tsx       # Authentication screen
│   │   ├── TimelineView.tsx     # Main timeline screen
│   │   ├── AddEventView.tsx     # Event creation screen
│   │   ├── EventDetailView.tsx  # Event details and attendees
│   │   └── PersonDetailView.tsx # Person details and relationships
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   └── components/              # Reusable components (future)
├── App.tsx                      # Main app component
├── FIREBASE_SETUP.md           # Firebase setup instructions
└── README.md                   # This file
```

## Data Model

### Collections in Firestore:

1. **Events**: `{ eventID, name, date, location, description, userId }`
2. **People**: `{ personID, firstName, lastName, organization, contactInfo, notes, userId }`
3. **Attendance**: `{ attendanceID, eventID, personID, userId }` (Junction table)
4. **Relationships**: `{ relationshipID, personA_ID, personB_ID, type, userId }`

## Usage

### Getting Started:
1. **Sign Up**: Create a new account with email and password
2. **Sign In**: Use your credentials to access the app
3. **Create Events**: Tap the "+" button to add your first event
4. **Add Attendees**: Open event details and add people who attended
5. **Track Relationships**: Link people together with relationship types

### Key Features:
- **Timeline**: View all events in chronological order
- **Event Details**: See full event information and manage attendees
- **Person Profiles**: View someone's event history and relationships
- **Real-time Updates**: Changes sync automatically across devices

## Development

### Adding New Features:
1. Create new screens in `src/screens/`
2. Add navigation routes in `src/navigation/AppNavigator.tsx`
3. Update types in `src/types/index.ts`
4. Add Firebase functions in `src/api/firebase.ts`

### Code Style:
- Use TypeScript for all components
- Follow React Native best practices
- Use functional components with hooks
- Keep components focused and reusable

## Deployment

### For Testing:
- Use Expo Go app for quick testing on physical devices
- Use simulators for development

### For Production:
- Build with Expo Application Services (EAS)
- Configure Firebase for production environment
- Set up proper security rules
- Use environment variables for sensitive data

## Troubleshooting

### Common Issues:

1. **Firebase Connection Errors**:
   - Verify Firebase configuration
   - Check internet connection
   - Ensure Firestore rules allow your operations

2. **Authentication Issues**:
   - Verify Email/Password is enabled in Firebase Console
   - Check for typos in email/password

3. **Build Errors**:
   - Clear Metro cache: `npx expo start --clear`
   - Delete node_modules and reinstall: `rm -rf node_modules && npm install`

4. **Navigation Issues**:
   - Ensure all screens are properly registered
   - Check parameter passing between screens

### Getting Help:
- Check the [Expo Documentation](https://docs.expo.dev/)
- Review [Firebase Documentation](https://firebase.google.com/docs)
- Check the [React Navigation docs](https://reactnavigation.org/)

## Future Enhancements

- [ ] Search functionality for people and events
- [ ] Photo uploads for events and people
- [ ] Export functionality (CSV, PDF)
- [ ] Offline support
- [ ] Push notifications
- [ ] Data visualization (relationship graphs)
- [ ] Bulk import/export
- [ ] Advanced filtering and sorting

## License

This project is for educational/demonstration purposes. Please ensure you have proper licensing for any production use.


