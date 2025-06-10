import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSettings } from "../SettingsContext";
import translations from "../translations";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Ionicons } from "@expo/vector-icons";

const OrderHistoryScreen = ({ navigation }) => {
  const { language, darkMode } = useSettings();
  const t = translations[language];
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback(async () => {
    const data = await AsyncStorage.getItem("orders");
    setOrders(data ? JSON.parse(data) : []);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchOrders);
    return unsubscribe;
  }, [navigation, fetchOrders]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const clearHistory = () => {
    Alert.alert(
      language === "nl" ? "Weet je het zeker?" : "Are you sure?",
      language === "nl"
        ? "Wil je echt je bestelgeschiedenis wissen?"
        : "Do you really want to clear your order history?",
      [
        { text: t.close, style: "cancel" },
        {
          text: language === "nl" ? "Wissen" : "Clear",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("orders");
            setOrders([]);
          },
        },
      ]
    );
  };

  const renderOrder = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("OrderDetailScreen", { order: item })}
      activeOpacity={0.85}
      style={[
        styles.orderCard,
        darkMode && { backgroundColor: "#333" },
        { borderLeftWidth: 6, borderLeftColor: index % 2 === 0 ? "#ffe066" : "#e53935" },
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
        <Icon name="receipt" size={22} color={darkMode ? "#ffe066" : "#e53935"} style={{ marginRight: 8 }} />
        <Text style={[styles.orderDate, darkMode && { color: "#ffe066" }]}>
          {new Date(item.date).toLocaleString(language)}
        </Text>
      </View>
      <Text style={[styles.orderTotal, darkMode && { color: "#fff" }]}>
        {t.total}: €{item.total.toFixed(2)}
      </Text>
      {item.items.map((orderItem, idx) => (
        <View key={idx} style={{ flexDirection: "row", alignItems: "center", marginLeft: 8 }}>
          <Icon name="local-drink" size={16} color={darkMode ? "#ffe066" : "#e53935"} style={{ marginRight: 4 }} />
          <Text style={[styles.orderItem, darkMode && { color: "#fff" }]}>
            {orderItem.quantity}x {orderItem.title}
          </Text>
        </View>
      ))}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, darkMode && { backgroundColor: "#222" }]}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back-ios" size={24} color={darkMode ? "#ffe066" : "#333"} />
        <Text style={[styles.backText, darkMode && { color: "#ffe066" }]}>{t.back}</Text>
      </TouchableOpacity>
      <Text style={[styles.heading, darkMode && { color: "#ffe066" }]}>
        {language === "nl" ? "Bestelgeschiedenis" : "Order History"}
      </Text>
      {orders.length > 0 && (
        <TouchableOpacity
          style={{
            alignSelf: "flex-end",
            marginBottom: 16,
            backgroundColor: darkMode ? "#ffe066" : "#e53935",
            padding: 10,
            borderRadius: 8,
          }}
          onPress={clearHistory}
        >
          <Text style={{ color: darkMode ? "#333" : "#fff", fontWeight: "bold" }}>
            {language === "nl" ? "Geschiedenis wissen" : "Clear history"}
          </Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={darkMode ? "#ffe066" : "#e53935"}
          />
        }
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 60 }}>
            <Ionicons
              name="cube-outline"
              size={100}
              color={darkMode ? "#ffe066" : "#bbb"}
              style={{ marginBottom: 20, opacity: 0.7 }}
            />
            <Text style={{ color: darkMode ? "#fff" : "#333", fontSize: 16, textAlign: "center" }}>
              {language === "nl" ? "Nog geen bestellingen." : "No orders yet."}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24 },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 16,
    alignSelf: "flex-start",
  },
  backText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 4,
  },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 24 },
  orderCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    marginLeft: 2,
    marginRight: 2,
  },
  orderDate: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  orderTotal: {
    fontSize: 16,
    marginBottom: 8,
  },
  orderItem: {
    fontSize: 15,
    marginLeft: 0,
  },
});

export default OrderHistoryScreen;