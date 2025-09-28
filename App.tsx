import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { onAuthStateChange } from './src/api/firebase';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('Setting up auth state listener...');
    const unsubscribe = onAuthStateChange((user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppNavigator 
        isAuthenticated={isAuthenticated}
        onAuthSuccess={() => {
          console.log('onAuthSuccess called, setting authenticated to true');
          setIsAuthenticated(true);
        }}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
