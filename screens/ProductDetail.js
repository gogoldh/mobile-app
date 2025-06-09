import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useCart } from "../CartContext";
import { useSettings } from "../SettingsContext";
import translations from "../translations";

const isValidUri = (uri) => typeof uri === "string" && uri.trim().length > 0;

const ProductDetail = ({ route, navigation }) => {
  const { product, handleAddToCart } = route.params || {};
  const [quantity, setQuantity] = useState(1);
  const { setCart } = useCart();
  const { language, darkMode } = useSettings();
  const t = translations[language];

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const addToCart = () => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const handleBestel = () => {
    if (handleAddToCart) {
      handleAddToCart(product, quantity);
    } else {
      addToCart();
    }
    navigation.goBack();
  };

  return (
    <View style={[styles.container, darkMode && { backgroundColor: "#222" }]}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back-ios" size={24} color={darkMode ? "#ffe066" : "#333"} />
        <Text style={{ fontSize: 16, color: darkMode ? "#ffe066" : "#333", marginLeft: 4 }}>{t.back}</Text>
      </TouchableOpacity>

      {isValidUri(product?.image?.uri) ? (
        <Image source={{ uri: product.image.uri }} style={styles.image} resizeMode="contain" />
      ) : (
        <View style={[styles.image, styles.noImage, darkMode && { backgroundColor: "#444" }]}>
          <Text style={{ color: darkMode ? "#ffe066" : "#333" }}>{t.noImage}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={[styles.name, darkMode && { color: "#ffe066" }]}>
          {product?.fieldData?.title || product?.title || t.nameNotAvailable}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.description, darkMode && { color: "#ffe066" }]}>
          {product?.fieldData?.subtitle || product?.subtitle || t.noDescription}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.price, darkMode && { color: "#ffe066" }]}>
          {product?.price ? `€${product.price}` : t.priceNotAvailable}
        </Text>
        <View style={[styles.divider, darkMode && { backgroundColor: "#444" }]} />
      </View>

      <View style={styles.section}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity style={[styles.qtyButton, darkMode && { backgroundColor: "#ffe066" }]} onPress={decrement}>
            <Text style={[styles.qtyButtonText, darkMode && { color: "#333" }]}>-</Text>
          </TouchableOpacity>

          <Text style={[styles.quantityText, darkMode && { color: "#ffe066" }]}>{quantity}</Text>

          <TouchableOpacity style={[styles.qtyButton, darkMode && { backgroundColor: "#ffe066" }]} onPress={increment}>
            <Text style={[styles.qtyButtonText, darkMode && { color: "#333" }]}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.divider, darkMode && { backgroundColor: "#444" }]} />
      </View>

      <TouchableOpacity style={[styles.button, darkMode && { backgroundColor: "#ffe066" }]} onPress={handleBestel}>
        <Text style={[styles.buttonText, darkMode && { color: "#333" }]}>{t.bestel}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 10,
    marginTop: 20,
  },
  image: {
    width: "100%",
    height: 250,
    marginBottom: 30,
  },
  noImage: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
  },
  section: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    width: "80%",
    marginTop: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 2,
    textAlign: "center",
    color: "#222",
  },
  description: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
    paddingHorizontal: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyButton: {
    backgroundColor: "#333",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  qtyButtonText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 20,
    minWidth: 40,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#333",
    paddingVertical: 15,
    paddingHorizontal: 60,
    marginTop: 0,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});

export default ProductDetail;