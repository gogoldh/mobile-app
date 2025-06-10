import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useCart } from "../CartContext";
import { useSettings } from "../SettingsContext";
import translations from "../translations";

const CartScreen = ({ navigation }) => {
  const { cart, setCart } = useCart();
  const { language, darkMode } = useSettings();
  const t = translations[language];
  const [showThankYou, setShowThankYou] = useState(false);

  // Snackbar state
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [lastRemoved, setLastRemoved] = useState(null);
  const [snackbarTimer, setSnackbarTimer] = useState(null);

  // Mini product preview state
  const [previewItem, setPreviewItem] = useState(null);

  const handleIncrement = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrement = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Delete with snackbar/undo
  const handleDelete = (id) => {
    const item = cart.find((i) => i.id === id);
    setLastRemoved(item);
    setCart((prev) => prev.filter((i) => i.id !== id));
    setSnackbarVisible(true);
    if (snackbarTimer) clearTimeout(snackbarTimer);
    const timer = setTimeout(() => {
      setSnackbarVisible(false);
      setLastRemoved(null);
    }, 4000);
    setSnackbarTimer(timer);
  };

  const handleUndo = () => {
    if (lastRemoved) {
      setCart((prev) => [lastRemoved, ...prev]);
      setSnackbarVisible(false);
      setLastRemoved(null);
      if (snackbarTimer) clearTimeout(snackbarTimer);
    }
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  const handleBestel = async () => {
    // Save order to AsyncStorage
    const order = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      items: cart,
      total: totalPrice,
    };
    try {
      const existing = await AsyncStorage.getItem("orders");
      const orders = existing ? JSON.parse(existing) : [];
      orders.unshift(order); // add newest first
      await AsyncStorage.setItem("orders", JSON.stringify(orders));
    } catch (e) {
      // handle error if needed
    }
    setCart([]); // Clear cart
    setShowThankYou(true); // Show popup
  };

  // Mini product preview modal
  const renderPreviewModal = () => (
    <Modal
      visible={!!previewItem}
      transparent
      animationType="fade"
      onRequestClose={() => setPreviewItem(null)}
    >
      <View style={styles.previewOverlay}>
        <View style={[styles.previewModal, darkMode && { backgroundColor: "#222" }]}>
          {previewItem?.image?.uri ? (
            <Image source={{ uri: previewItem.image.uri }} style={styles.previewImage} />
          ) : (
            <View style={[styles.previewImage, styles.noImage, darkMode && { backgroundColor: "#444" }]}>
              <Text style={{ color: darkMode ? "#ffe066" : "#333" }}>{t.noImage}</Text>
            </View>
          )}
          <Text style={[styles.previewTitle, darkMode && { color: "#ffe066" }]}>{previewItem?.title}</Text>
          <Text style={[styles.previewPrice, darkMode && { color: "#ffe066" }]}>€{previewItem?.price?.toFixed(2) || "0.00"}</Text>
          <Text style={[styles.previewQty, darkMode && { color: "#fff" }]}>{t.quantity || "Aantal"}: {previewItem?.quantity}</Text>
          <TouchableOpacity style={styles.previewClose} onPress={() => setPreviewItem(null)}>
            <Text style={{ color: darkMode ? "#ffe066" : "#333", fontWeight: "bold" }}>{t.close}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Snackbar for undo
  const renderSnackbar = () =>
    snackbarVisible && (
      <View style={styles.snackbar}>
        <Text style={{ color: "#fff", flex: 1 }}>
          {t.removedFromCart || "Item verwijderd"}
        </Text>
        <TouchableOpacity onPress={handleUndo}>
          <Text style={{ color: "#ffe066", fontWeight: "bold", marginLeft: 16 }}>
            {t.undo || "Ongedaan maken"}
          </Text>
        </TouchableOpacity>
      </View>
    );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={1}
      onLongPress={() => setPreviewItem(item)}
      delayLongPress={250}
    >
      <View style={[
        styles.itemContainer,
        darkMode && { backgroundColor: "#333", borderColor: "#555" }
      ]}>
        {item.image?.uri ? (
          <Image source={{ uri: item.image.uri }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.noImage, darkMode && { backgroundColor: "#444" }]}>
            <Text style={{ color: darkMode ? "#ffe066" : "#333" }}>{t.noImage}</Text>
          </View>
        )}
        <View style={styles.info}>
          <Text style={[styles.title, darkMode && { color: "#ffe066" }]}>{item.title}</Text>
          <Text style={[styles.price, darkMode && { color: "#ffe066" }]}>€{item.price?.toFixed(2) || "0.00"}</Text>
          <View style={styles.quantityRow}>
            <TouchableOpacity
              style={[styles.qtyButton, darkMode && { backgroundColor: "#ffe066" }]}
              onPress={() => handleDecrement(item.id)}
            >
              <Text style={[styles.qtyButtonText, darkMode && { color: "#333" }]}>-</Text>
            </TouchableOpacity>
            <Text style={[styles.quantityText, darkMode && { color: "#ffe066" }]}>{item.quantity}</Text>
            <TouchableOpacity
              style={[styles.qtyButton, darkMode && { backgroundColor: "#ffe066" }]}
              onPress={() => handleIncrement(item.id)}
            >
              <Text style={[styles.qtyButtonText, darkMode && { color: "#333" }]}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
        >
          <Icon name="delete" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, darkMode && { backgroundColor: "#222" }]}>
      {/* Thank You Popup */}
      {showThankYou && (
        <View style={styles.popupOverlay}>
          <View style={[styles.popup, darkMode && { backgroundColor: "#333" }]}>
            <Text style={[styles.popupTitle, darkMode && { color: "#ffe066" }]}>{t.thankYou}</Text>
            <Text style={[styles.popupSubtitle, darkMode && { color: "#fff" }]}>
              {t.thankYouSubtitle}
            </Text>
           <TouchableOpacity
  style={styles.popupButton}
  onPress={() => {
    setShowThankYou(false);
    // Probeer eerst de parent, en als dat niet werkt, de parent van de parent
    if (navigation.getParent()?.navigate) {
      navigation.navigate("Home");
      navigation.getParent().navigate("Home");
    } else if (navigation.getParent()?.getParent()?.navigate) {
      navigation.getParent().getParent().navigate("Home");
    } else {
      navigation.navigate("Home");
    }
  }}
>
  <Text style={styles.popupButtonText}>{t.close}</Text>
</TouchableOpacity>
          </View>
        </View>
      )}

      {/* Mini Product Preview Modal */}
      {renderPreviewModal()}

      {/* Snackbar for Undo */}
      {renderSnackbar()}

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back-ios" size={24} color={darkMode ? "#fff" : "#333"} />
        <Text style={{ fontSize: 16, color: darkMode ? "#fff" : "#333", marginLeft: 4 }}>{t.back}</Text>
      </TouchableOpacity>
      <Text style={[styles.heading, darkMode && { color: "#ffe066" }]}>{t.cart}</Text>
      {cart.length === 0 ? (
        <View style={styles.centered}>
          <Text style={{ color: darkMode ? "#fff" : "#333" }}>{t.emptyCart}</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 120 }}
          />
          <View style={[styles.totalContainer, darkMode && { backgroundColor: "#222", borderTopColor: "#444" }]}>
            <Text style={[styles.totalText, darkMode && { color: "#ffe066" }]}>
              {t.total}: €{totalPrice.toFixed(2)}
            </Text>
            <TouchableOpacity style={styles.bestelButton} onPress={handleBestel}>
              <Text style={styles.bestelButtonText}>{t.bestel}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginTop: 16,
    alignSelf: "flex-start",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    alignSelf: "center",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 0,
    marginBottom: -4,
    padding: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 0,
    marginRight: 12,
  },
  noImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  price: {
    color: "#333",
    marginBottom: 8,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyButton: {
    backgroundColor: "#333",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 0,
  },
  qtyButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: "bold",
    minWidth: 24,
    textAlign: "center",
  },
  deleteButton: {
    backgroundColor: "#e53935",
    borderRadius: 20,
    padding: 6,
    marginLeft: 8,
  },
  totalContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    padding: 16,
    alignItems: "center",
    elevation: 10,
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  bestelButton: {
    backgroundColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 0,
  },
  bestelButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  // Popup styles
  popupOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  popup: {
    backgroundColor: "#fff",
    borderRadius: 0,
    padding: 32,
    alignItems: "center",
    width: "80%",
    elevation: 10,
  },
  popupTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  popupSubtitle: {
    fontSize: 16,
    color: "#444",
    marginBottom: 24,
    textAlign: "center",
  },
  popupButton: {
    backgroundColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 0,
  },
  popupButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
  // Snackbar styles
  snackbar: {
    position: "absolute",
    bottom: 90,
    left: 20,
    right: 20,
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 8,
    zIndex: 200,
  },
  // Mini product preview styles
  previewOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  previewModal: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    width: 300,
    elevation: 20,
  },
  previewImage: {
    width: 140,
    height: 140,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  previewPrice: {
    fontSize: 18,
    marginBottom: 8,
  },
  previewQty: {
    fontSize: 16,
    marginBottom: 16,
  },
  previewClose: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: "#eee",
    borderRadius: 8,
  },
});

export default CartScreen;