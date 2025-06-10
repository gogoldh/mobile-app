import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";
import ProductStack from "../navigation/ProductStack";
import HomeStack from "../navigation/HomeStack";
import OrderHistoryScreen from "../screens/OrderHistoryScreen";
import OrderDetailScreen from "../screens/OrderDetailScreen"; // <-- Import this!
import ProfileScreen from "../screens/ProfileScreen";
import { useSettings } from "../SettingsContext";
import { useProfile } from "../ProfileContext";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Create a stack for Orders
function OrdersStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OrderHistoryScreen" component={OrderHistoryScreen} />
      <Stack.Screen name="OrderDetailScreen" component={OrderDetailScreen} />
    </Stack.Navigator>
  );
}

const BottomNav = () => {
  const { darkMode, language } = useSettings();
  const { profileImage } = useProfile();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: darkMode ? "#ffe066" : "#e53935",
        tabBarInactiveTintColor: darkMode ? "#bbb" : "#888",
        tabBarStyle: {
          backgroundColor: darkMode ? "#222" : "#fff",
          borderTopWidth: 0.5,
          borderTopColor: darkMode ? "#444" : "#eee",
          height: 60,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Products") iconName = "beer";
          else if (route.name === "Orders") iconName = "receipt";
          else if (route.name === "Profile") {
            if (profileImage) {
              return (
                <Image
                  source={{ uri: profileImage }}
                  style={{
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    borderWidth: focused ? 2 : 0,
                    borderColor: focused ? "#ffe066" : "transparent",
                  }}
                />
              );
            }
            iconName = "person-circle";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabelStyle: {
          fontWeight: "bold",
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ tabBarLabel: language === "nl" ? "Home" : "Home" }}
      />
      <Tab.Screen
        name="Products"
        component={ProductStack}
        options={{ tabBarLabel: language === "nl" ? "Producten" : "Products" }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersStack} // <-- Use the stack here!
        options={{ tabBarLabel: language === "nl" ? "Bestellingen" : "Orders" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: language === "nl" ? "Profiel" : "Profile" }}
      />
    </Tab.Navigator>
  );
};

export default BottomNav;