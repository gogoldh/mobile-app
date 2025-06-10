import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BlogsScreen from "../screens/BlogScreen";
import BlogDetailScreen from "../screens/BlogDetailScreen";

const Stack = createStackNavigator();

const BlogStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="BlogsScreen"
      component={BlogsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="BlogDetailScreen"
      component={BlogDetailScreen}
      options={{ headerShown: false }} // <-- Hide the header here too!
    />
  </Stack.Navigator>
);

export default BlogStack;