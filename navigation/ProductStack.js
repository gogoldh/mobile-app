import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProductsScreen from "../screens/ProductScreen";
import ProductDetail from "../screens/ProductDetail";

const Stack = createStackNavigator();

const ProductStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="ProductsMain"
      component={ProductsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ProductDetail"
      component={ProductDetail}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default ProductStack;