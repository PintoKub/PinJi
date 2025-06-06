import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, View } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1, backgroundColor: '#1a1a1a' }}>
        <Tabs screenOptions={{
          headerStyle: {
            backgroundColor: '#1a1a1a',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: '600',
          },
          tabBarStyle: {
            backgroundColor: '#1a1a1a',
            borderTopWidth: 0,
            height: 60,
            paddingBottom: Platform.OS === 'android' ? 15 : 10,
            paddingTop: 10,
            position: 'absolute',
            bottom: Platform.OS === 'android' ? 35 : 0, // Increased to 35 for more space
          },
          tabBarActiveTintColor: '#9F7AEA',
          tabBarInactiveTintColor: '#888888',
        }}>
        <Tabs.Screen 
          name="index"
          options={{
            headerShown: false,
            title: 'Main',
            tabBarIcon: ({ color }) => (
              <Ionicons name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen 
          name="add-word"
          options={{
            title: 'Add',
            tabBarIcon: ({ color }) => (
              <Ionicons name="add-circle" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen 
          name="edit"
          options={{
            title: 'Edit',
            tabBarIcon: ({ color }) => (
              <Ionicons name="create" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen 
          name="practice"
          options={{
            title: 'Practice',
            tabBarIcon: ({ color }) => (
              <Ionicons name="school" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
      {Platform.OS === 'android' && (
        <View 
          style={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            height: 35, // Height matches the bottom spacing
            backgroundColor: '#1a1a1a', // Same color as navbar
          }} 
        />
      )}
      </View>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
