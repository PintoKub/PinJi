import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from './components/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import AddWordScreen from './screens/AddWordScreen';
import ReviewScreen from './screens/ReviewScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <SplashScreen onFinish={() => setIsLoading(false)} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Japanese Flashcards" component={HomeScreen} />
        <Stack.Screen name="Add Word" component={AddWordScreen} />
        <Stack.Screen name="Review" component={ReviewScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

<Stack.Navigator>
  <Stack.Screen name="Japanese Flashcards" component={HomeScreen} />
  <Stack.Screen name="Add Word" component={AddWordScreen} />
  <Stack.Screen name="Review" component={ReviewScreen} />
</Stack.Navigator>