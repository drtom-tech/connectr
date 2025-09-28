import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  query, 
  where, 
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { Event, Person, Attendance, Relationship } from '../types';

// Firebase configuration
// Note: In a real app, these should be environment variables
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "connectr-mvp.firebaseapp.com",
  projectId: "connectr-mvp",
  storageBucket: "connectr-mvp.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id-here"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Auth functions
export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Event CRUD operations
export const createEvent = async (data: Partial<Event>): Promise<void> => {
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  try {
    await addDoc(collection(db, 'events'), {
      ...data,
      userId: user.uid,
      date: Timestamp.fromDate(data.date || new Date()),
      createdAt: Timestamp.now()
    });
  } catch (error) {
    throw error;
  }
};

export const getEvents = async (userId: string): Promise<Event[]> => {
  try {
    const eventsRef = collection(db, 'events');
    const q = query(
      eventsRef, 
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      eventID: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate()
    } as Event));
  } catch (error) {
    throw error;
  }
};

// Person CRUD operations
export const createPerson = async (data: Partial<Person>): Promise<string> => {
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  try {
    const docRef = await addDoc(collection(db, 'people'), {
      ...data,
      userId: user.uid,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const getPeople = async (userId: string): Promise<Person[]> => {
  try {
    const peopleRef = collection(db, 'people');
    const q = query(peopleRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      personID: doc.id,
      ...doc.data()
    } as Person));
  } catch (error) {
    throw error;
  }
};

// Attendance operations
export const linkPersonToEvent = async (personId: string, eventId: string): Promise<void> => {
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  try {
    await addDoc(collection(db, 'attendance'), {
      personID: personId,
      eventID: eventId,
      userId: user.uid,
      createdAt: Timestamp.now()
    });
  } catch (error) {
    throw error;
  }
};

export const getAttendeesForEvent = async (eventId: string): Promise<Person[]> => {
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  try {
    // First get all attendance records for this event
    const attendanceRef = collection(db, 'attendance');
    const attendanceQuery = query(
      attendanceRef,
      where('eventID', '==', eventId),
      where('userId', '==', user.uid)
    );
    const attendanceSnapshot = await getDocs(attendanceQuery);
    
    // Get person IDs
    const personIds = attendanceSnapshot.docs.map(doc => doc.data().personID);
    
    if (personIds.length === 0) return [];
    
    // Get all people for these IDs
    const peopleRef = collection(db, 'people');
    const peopleQuery = query(
      peopleRef,
      where('userId', '==', user.uid),
      where('__name__', 'in', personIds)
    );
    const peopleSnapshot = await getDocs(peopleQuery);
    
    return peopleSnapshot.docs.map(doc => ({
      personID: doc.id,
      ...doc.data()
    } as Person));
  } catch (error) {
    throw error;
  }
};

export const getEventsForPerson = async (personId: string): Promise<Event[]> => {
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  try {
    // First get all attendance records for this person
    const attendanceRef = collection(db, 'attendance');
    const attendanceQuery = query(
      attendanceRef,
      where('personID', '==', personId),
      where('userId', '==', user.uid)
    );
    const attendanceSnapshot = await getDocs(attendanceQuery);
    
    // Get event IDs
    const eventIds = attendanceSnapshot.docs.map(doc => doc.data().eventID);
    
    if (eventIds.length === 0) return [];
    
    // Get all events for these IDs
    const eventsRef = collection(db, 'events');
    const eventsQuery = query(
      eventsRef,
      where('userId', '==', user.uid),
      where('__name__', 'in', eventIds),
      orderBy('date', 'desc')
    );
    const eventsSnapshot = await getDocs(eventsQuery);
    
    return eventsSnapshot.docs.map(doc => ({
      eventID: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate()
    } as Event));
  } catch (error) {
    throw error;
  }
};

// Relationship operations
export const createRelationship = async (personAId: string, personBId: string, type: string): Promise<void> => {
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  try {
    await addDoc(collection(db, 'relationships'), {
      personA_ID: personAId,
      personB_ID: personBId,
      type: type,
      userId: user.uid,
      createdAt: Timestamp.now()
    });
  } catch (error) {
    throw error;
  }
};

export const getRelationshipsForPerson = async (personId: string): Promise<{person: Person, type: string}[]> => {
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  try {
    const relationshipsRef = collection(db, 'relationships');
    const q = query(
      relationshipsRef,
      where('userId', '==', user.uid),
      where('personA_ID', '==', personId)
    );
    const querySnapshot = await getDocs(q);
    
    const relationships = [];
    
    for (const doc of querySnapshot.docs) {
      const relationshipData = doc.data();
      const otherPersonId = relationshipData.personB_ID;
      
      // Get the other person's details
      const personDoc = await getDocs(query(
        collection(db, 'people'),
        where('userId', '==', user.uid),
        where('__name__', '==', otherPersonId)
      ));
      
      if (!personDoc.empty) {
        const personData = personDoc.docs[0].data() as Person;
        relationships.push({
          person: {
            personID: personDoc.docs[0].id,
            ...personData
          },
          type: relationshipData.type
        });
      }
    }
    
    // Also check for relationships where this person is personB
    const q2 = query(
      relationshipsRef,
      where('userId', '==', user.uid),
      where('personB_ID', '==', personId)
    );
    const querySnapshot2 = await getDocs(q2);
    
    for (const doc of querySnapshot2.docs) {
      const relationshipData = doc.data();
      const otherPersonId = relationshipData.personA_ID;
      
      // Get the other person's details
      const personDoc = await getDocs(query(
        collection(db, 'people'),
        where('userId', '==', user.uid),
        where('__name__', '==', otherPersonId)
      ));
      
      if (!personDoc.empty) {
        const personData = personDoc.docs[0].data() as Person;
        relationships.push({
          person: {
            personID: personDoc.docs[0].id,
            ...personData
          },
          type: relationshipData.type
        });
      }
    }
    
    return relationships;
  } catch (error) {
    throw error;
  }
};


