import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useSettings } from "../SettingsContext";
import translations from "../translations";

const ProductCard = ({ title, subtitle, price, image, onPress }) => {
  const { language, darkMode } = useSettings();
  const t = translations[language];

  return (
    <TouchableOpacity
      style={[styles.card, darkMode && { backgroundColor: "#222", borderColor: "#444" }]}
      onPress={onPress} // <-- Gebruik de prop!
    >
      {image?.uri ? (
        <Image source={image} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={{ color: darkMode ? "#fff" : "#333" }}>{t.noImage}</Text>
        </View>
      )}
      <Text style={[styles.title, darkMode && { color: "#ffe066" }]}>{title}</Text>
      {/* <Text style={styles.subtitle}>{subtitle}</Text> */}
      <Text style={[styles.price, darkMode && { color: "#ffe066" }]}>€{price.toFixed(2)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "50%",
    marginBottom: 0,
    borderColor: "#ddd",
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  placeholder: {
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    marginTop: 8,
    marginHorizontal: 8,
    color: "#222",
  },
  subtitle: {
    color: "#555",
  },
  price: {
    marginTop: 4,
    color: "#000",
    margin: 8,
  },
});

export default ProductCard;