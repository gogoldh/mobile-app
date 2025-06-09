import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BottomNav from "./components/BottomNav";
import { CartProvider } from './CartContext'; 
import { SettingsProvider } from './SettingsContext'; 
import { ProfileProvider } from "./ProfileContext";

export default function App() {
  return (
    <SettingsProvider>
      <CartProvider>
        <ProfileProvider>
          <NavigationContainer>
            <BottomNav />
          </NavigationContainer>
        </ProfileProvider>
      </CartProvider>
    </SettingsProvider>
  );
}