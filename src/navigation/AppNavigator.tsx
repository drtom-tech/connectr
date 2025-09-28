import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

// Import screens
import AuthScreen from '../screens/AuthScreen';
import TimelineView from '../screens/TimelineView';
import AddEventView from '../screens/AddEventView';
import EventDetailView from '../screens/EventDetailView';
import PersonDetailView from '../screens/PersonDetailView';

const Stack = createStackNavigator<RootStackParamList>();

interface AppNavigatorProps {
  isAuthenticated: boolean;
  onAuthSuccess: () => void;
}

export default function AppNavigator({ isAuthenticated, onAuthSuccess }: AppNavigatorProps) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // We're handling headers in individual screens
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen name="Auth">
            {() => <AuthScreen onAuthSuccess={onAuthSuccess} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Timeline">
              {(props) => (
                <TimelineView
                  {...props}
                  onNavigateToAddEvent={() => props.navigation.navigate('AddEvent')}
                  onNavigateToEventDetail={(eventId: string) => 
                    props.navigation.navigate('EventDetail', { eventId })
                  }
                />
              )}
            </Stack.Screen>
            
            <Stack.Screen name="AddEvent">
              {(props) => (
                <AddEventView
                  {...props}
                  onNavigateBack={() => props.navigation.goBack()}
                />
              )}
            </Stack.Screen>
            
            <Stack.Screen name="EventDetail">
              {(props) => (
                <EventDetailView
                  {...props}
                  eventId={props.route.params.eventId}
                  onNavigateBack={() => props.navigation.goBack()}
                  onNavigateToPersonDetail={(personId: string) => 
                    props.navigation.navigate('PersonDetail', { personId })
                  }
                />
              )}
            </Stack.Screen>
            
            <Stack.Screen name="PersonDetail">
              {(props) => (
                <PersonDetailView
                  {...props}
                  personId={props.route.params.personId}
                  onNavigateBack={() => props.navigation.goBack()}
                  onNavigateToEventDetail={(eventId: string) => 
                    props.navigation.navigate('EventDetail', { eventId })
                  }
                />
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}


