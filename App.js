import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomNav from "./components/BottomNav";
import CheckOutScreen from "./screens/CheckOutScreen";
import { CartProvider } from './CartContext'; 
import { SettingsProvider } from './SettingsContext'; 
import { ProfileProvider } from "./ProfileContext";
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import OrderDetailScreen from './screens/OrderDetailScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SettingsProvider>
      <CartProvider>
        <ProfileProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Main" component={BottomNav} />
              <Stack.Screen name="CheckOutScreen" component={CheckOutScreen} />
              <Stack.Screen name="OrderHistoryScreen" component={OrderHistoryScreen} />
              <Stack.Screen name="OrderDetailScreen" component={OrderDetailScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </ProfileProvider>
      </CartProvider>
    </SettingsProvider>
  );
}