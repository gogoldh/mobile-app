import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useSettings } from "../SettingsContext";
import translations from "../translations";
import Icon from "react-native-vector-icons/MaterialIcons";

const OrderDetailScreen = ({ route, navigation }) => {
  const { order } = route.params;
  const { language, darkMode } = useSettings();
  const t = translations[language];

  return (
    <View style={[styles.container, darkMode && { backgroundColor: "#222" }]}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back-ios" size={24} color={darkMode ? "#ffe066" : "#333"} />
        <Text style={[styles.backText, darkMode && { color: "#ffe066" }]}>{t.back}</Text>
      </TouchableOpacity>
      <Text style={[styles.heading, darkMode && { color: "#ffe066" }]}>
        {language === "nl" ? "Besteldetails" : "Order Details"}
      </Text>
      <Text style={[styles.label, darkMode && { color: "#fff" }]}>
        {t.date}: {new Date(order.date).toLocaleString(language)}
      </Text>
      <Text style={[styles.label, darkMode && { color: "#fff" }]}>
        {t.total}: €{order.total.toFixed(2)}
      </Text>
      <View style={[styles.divider, darkMode && { backgroundColor: "#444" }]} />
      <ScrollView>
        {order.items.map((item, idx) => (
          <View key={idx} style={[styles.itemRow, darkMode && { backgroundColor: "#333" }]}>
            <Icon name="local-drink" size={20} color={darkMode ? "#ffe066" : "#e53935"} style={{ marginRight: 8 }} />
            <Text style={[styles.itemText, darkMode && { color: "#fff" }]}>
              {item.quantity}x {item.title} <Text style={{ color: darkMode ? "#ffe066" : "#333" }}>€{item.price?.toFixed(2)}</Text>
            </Text>
          </View>
        ))}
      </ScrollView>
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
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  label: { fontSize: 16, marginBottom: 8 },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    width: "100%",
    marginVertical: 16,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
    marginBottom: 8,
  },
  itemText: {
    fontSize: 16,
  },
});

export default OrderDetailScreen;