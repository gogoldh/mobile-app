import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useCart } from "../CartContext";
import { useSettings } from "../SettingsContext";
import translations from "../translations";
import { Ionicons } from "@expo/vector-icons";

const CheckoutScreen = ({ navigation }) => {
  const { cart, setCart } = useCart();
  const { language, darkMode } = useSettings();
  const t = translations[language];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  // Only enable button if all required fields are filled
  const isFormValid = name.trim() && email.trim() && address.trim();

  const handlePlaceOrder = async () => {
    if (!isFormValid) {
      Alert.alert(
        t.missingFields || "Please fill in all required fields"
      );
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setCart([]);
      Alert.alert(
        t.thankYou || "Thank you!",
        t.orderPlaced || "Your order has been placed.",
        [
          {
            text: t.close || "Close",
            onPress: () => navigation.navigate("Home"),
          },
        ]
      );
    }, 1200);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: darkMode ? "#181818" : "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          darkMode && { backgroundColor: "#181818" },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={26} color={darkMode ? "#ffe066" : "#222"} />
          <Text style={[styles.backText, darkMode && { color: "#ffe066" }]}>
            {t.back || "Back"}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.logo, darkMode && { color: "#ffe066" }]}>Circus Brouwerij</Text>
        <Text style={[styles.heading, darkMode && { color: "#ffe066" }]}>
          {t.checkout || "Checkout"}
        </Text>
        <View style={[styles.inputBox, darkMode && { backgroundColor: "#222" }]}>
          <TextInput
            style={[
              styles.input,
              darkMode && { color: "#ffe066", borderBottomColor: "#444" },
            ]}
            placeholder={t.fullName || "Full Name *"}
            placeholderTextColor={darkMode ? "#bbb" : "#888"}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <TextInput
            style={[
              styles.input,
              darkMode && { color: "#ffe066", borderBottomColor: "#444" },
            ]}
            placeholder={t.email || "Email *"}
            placeholderTextColor={darkMode ? "#bbb" : "#888"}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={[
              styles.input,
              darkMode && { color: "#ffe066", borderBottomColor: "#444" },
            ]}
            placeholder={t.address || "Address *"}
            placeholderTextColor={darkMode ? "#bbb" : "#888"}
            value={address}
            onChangeText={setAddress}
          />
          <TextInput
            style={[
              styles.input,
              darkMode && { color: "#ffe066", borderBottomColor: "#444" },
            ]}
            placeholder={t.phoneNumber || "Phone Number"}
            placeholderTextColor={darkMode ? "#bbb" : "#888"}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>
        <View style={[styles.summaryBox, darkMode && { backgroundColor: "#222", borderColor: "#333" }]}>
          <Text style={[styles.summaryTitle, darkMode && { color: "#ffe066" }]}>
            {t.orderSummary || "Order Summary"}
          </Text>
          {cart.map((item) => (
            <View key={item.id} style={styles.summaryRow}>
              <Text style={[styles.summaryItem, darkMode && { color: "#ffe066" }]}>
                {item.title} {item.quantity > 1 ? `x${item.quantity}` : ""}
              </Text>
              <Text style={[styles.summaryPrice, darkMode && { color: "#ffe066" }]}>
                €{(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryTotal, darkMode && { color: "#ffe066" }]}>
              {t.total || "Total"}:
            </Text>
            <Text style={[styles.summaryTotal, darkMode && { color: "#ffe066" }]}>
              €{totalPrice.toFixed(2)}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.button,
            (!isFormValid || submitting) && styles.buttonDisabled,
            darkMode && styles.buttonDark,
          ]}
          onPress={handlePlaceOrder}
          disabled={!isFormValid || submitting}
          activeOpacity={isFormValid && !submitting ? 0.7 : 1}
        >
          <Text style={[
            styles.buttonText,
            (!isFormValid || submitting) && styles.buttonTextDisabled,
            darkMode && styles.buttonTextDark,
          ]}>
            {t.placeOrder || "Place Order"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 48,
    flexGrow: 1,
    backgroundColor: "#fff",
  },
  logo: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    fontSize: 36,
    letterSpacing: 2,
    marginBottom: 16,
    alignSelf: "center",
    color: "#222",
    textAlign: "center",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 24,
    alignSelf: "center",
    color: "#222",
  },
  inputBox: {
    backgroundColor: "#fafafa",
    borderRadius: 0,
    padding: 0,
    marginBottom: 24,
    elevation: 0,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    fontSize: 16,
    paddingVertical: 14,
    paddingHorizontal: 0,
    marginBottom: 0,
    color: "#222",
    backgroundColor: "transparent",
    fontWeight: "bold",
  },
  summaryBox: {
    backgroundColor: "#f8f8f8",
    borderRadius: 0,
    padding: 16,
    marginBottom: 32,
    elevation: 0,
    borderWidth: 1,
    borderColor: "#eee",
  },
  summaryTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 12,
    color: "#222",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  summaryItem: {
    fontSize: 16,
    color: "#222",
    fontWeight: "bold",
  },
  summaryPrice: {
    fontSize: 16,
    color: "#222",
    fontWeight: "bold",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },
  summaryTotal: {
    fontWeight: "bold",
    fontSize: 17,
    color: "#222",
  },
  button: {
    backgroundColor: "#333",
    borderRadius: 0,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 32,
    elevation: 0,
  },
  buttonDark: {
    backgroundColor: "#ffe066",
  },
  buttonDisabled: {
    backgroundColor: "#bbb",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
  buttonTextDark: {
    color: "#333",
  },
  buttonTextDisabled: {
    color: "#eee",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginLeft: -8,
  },
  backText: {
    fontSize: 16,
    color: "#222",
    marginLeft: 4,
    fontWeight: "bold",
  },
});

export default CheckoutScreen;