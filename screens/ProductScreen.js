import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Animated,
} from "react-native";
import ProductCard from "../components/ProductCard";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from '../CartContext';
import { useSettings } from '../SettingsContext';
import translations from '../translations';

const FOOTER_HEIGHT = 100;

const ProductsScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [showSearch, setShowSearch] = useState(false);
  const searchWidth = useState(new Animated.Value(0))[0];

  const { cart, setCart } = useCart();
  const { language, darkMode } = useSettings();
  const t = translations[language];

  const categories = [
    { id: "all", name: t.all },
    { id: "68454d388c39cdc31dbbddb0", name: t.ipa },
    { id: "68454d388c39cdc31dbbddb3", name: t.tripel },
    { id: "68454d388c39cdc31dbbddae", name: t.other },
  ];

  useEffect(() => {
    fetch(
      "https://api.webflow.com/v2/sites/68454d388c39cdc31dbbdd38/products",
      {
        headers: {
          Authorization:
            "Bearer e4aad0b7e7d0f67be1de3511c9fe30476df73d2e7cb970a9fb43606014666c09",
          "accept-version": "1.0.0",
        },
      }
    )
      .then((res) => res.json())
      .then((prodData) => {
        const items = Array.isArray(prodData.items)
          ? prodData.items
          : Array.isArray(prodData.products)
          ? prodData.products
          : [];

        const formattedProducts = items.map((item) => {
          const rawCategoryIds =
            item.categoryIds ||
            item.product?.categoryIds ||
            (item.product?.fieldData?.category
              ? [item.product.fieldData.category]
              : []) ||
            [];

          const normalizedCategoryIds = rawCategoryIds
            .flat()
            .map((cat) =>
              typeof cat === "object" && cat.id ? String(cat.id) : String(cat)
          );

          return {
            id: item.product?.id || item.id,
            title: item.product?.fieldData?.name || item.name || t.nameNotAvailable,
            subtitle:
              item.product?.fieldData?.description ||
              item.description ||
              t.noDescription,
            price: (item.skus?.[0]?.fieldData?.price?.value || 0) / 100,
            image: {
              uri:
                item.skus?.[0]?.fieldData?.["main-image"]?.url ||
                item.image?.url ||
                undefined,
            },
            categories: normalizedCategoryIds,
            date: item.updatedOn || item.createdOn || item.product?.updatedOn || item.product?.createdOn || "",
          };
        });

        setProducts(formattedProducts);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
        setLoading(false);
      });
  }, [language]);

  const filteredByCategory =
    selectedCategoryId === "all"
      ? products
      : products.filter((product) =>
          product.categories.includes(selectedCategoryId)
        );

  const filteredBySearch = filteredByCategory.filter((p) =>
    (p.title || "").toLowerCase().includes(search.toLowerCase())
  );

  const sortedProducts = [...filteredBySearch].sort((a, b) => {
    if (sortBy === "name-asc") return (a.title || "").localeCompare(b.title || "");
    if (sortBy === "price-asc") return (a.price || 0) - (b.price || 0);
    if (sortBy === "price-desc") return (b.price || 0) - (a.price || 0);
    if (sortBy === "date-desc") return new Date(b.date || 0) - new Date(a.date || 0);
    return 0;
  });

  const handleAddToCart = (product, quantity = 1) => {
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

  useEffect(() => {
    Animated.timing(searchWidth, {
      toValue: showSearch ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [showSearch]);

  const searchBarWidth = searchWidth.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 220],
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text>{t.loading}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, darkMode && { backgroundColor: "#222" }]}>
      {/* Top bar with icons and animated search */}
      <View style={styles.topBar}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setShowSearch((v) => !v)}
          >
            <Ionicons
              name={showSearch ? "close" : "search"}
              size={26}
              color={darkMode ? "#ffe066" : "#333"}
            />
          </TouchableOpacity>
          <Animated.View style={[styles.animatedSearch, { width: searchBarWidth }]}>
            {showSearch && (
              <TextInput
                autoFocus
                style={{
                  flex: 1,
                  backgroundColor: darkMode ? "#333" : "#eee",
                  color: darkMode ? "#ffe066" : "#333",
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  height: 40,
                  marginLeft: 8,
                }}
                placeholder={t.search || "Zoek..."}
                placeholderTextColor={darkMode ? "#ffe06699" : "#888"}
                value={search}
                onChangeText={setSearch}
                onBlur={() => setShowSearch(false)}
              />
            )}
          </Animated.View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            style={[styles.cartButton, darkMode && { backgroundColor: "#333" }]}
            onPress={() => navigation.navigate("Home", { screen: "CartScreen" })}
          >
            <Ionicons name="cart" size={28} color={darkMode ? "#ffe066" : "#333"} />
            {cart.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.cartButton,
              { marginLeft: 12 },
              darkMode
                ? { backgroundColor: "#333" }
                : { backgroundColor: "#fff" }
            ]}
            onPress={() => {
              if (sortBy === "name-asc") setSortBy("price-asc");
              else if (sortBy === "price-asc") setSortBy("price-desc");
              else if (sortBy === "price-desc") setSortBy("date-desc");
              else setSortBy("name-asc");
            }}
          >
            <Ionicons
              name={
                sortBy === "name-asc"
                  ? "text"
                  : sortBy === "price-asc"
                  ? "pricetag-outline"
                  : sortBy === "price-desc"
                  ? "pricetags"
                  : "time-outline"
              }
              size={26}
              color={darkMode ? "#ffe066" : "#333"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryButton,
                selectedCategoryId === cat.id && styles.categoryButtonActive,
                darkMode && { backgroundColor: "#333" },
                selectedCategoryId === cat.id && darkMode && { backgroundColor: "#ffe066" },
              ]}
              onPress={() => setSelectedCategoryId(cat.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategoryId === cat.id && styles.categoryTextActive,
                  darkMode && { color: "#ffe066" },
                  selectedCategoryId === cat.id && darkMode && { color: "#333" },
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={[styles.heading, darkMode && { color: "#ffe066" }]}>{t.beers}</Text>

        <View style={styles.row}>
          {sortedProducts.length === 0 ? (
            <Text style={{ color: darkMode ? "#fff" : "#333" }}>{t.empty}</Text>
          ) : (
            sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                title={product.title}
                subtitle={product.subtitle}
                price={product.price}
                image={product.image}
                onPress={() =>
                  navigation.navigate("ProductDetail", {
                    product,
                    handleAddToCart,
                  })
                }
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 8,
    backgroundColor: "transparent",
    zIndex: 10,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  animatedSearch: {
    overflow: "hidden",
    height: 40,
    marginLeft: 0,
    justifyContent: "center",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: FOOTER_HEIGHT,
  },
  categoryScroll: {
    maxHeight: 50,
    marginBottom: 16,
  },
  categoryContainer: {
    alignItems: "center",
    paddingHorizontal: 8,
  },
  categoryButton: {
    marginRight: 10,
    backgroundColor: "#eee",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  categoryButtonActive: {
    backgroundColor: "#333",
  },
  categoryText: {
    color: "#333",
  },
  categoryTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cartButton: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cartBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "red",
    borderRadius: 8,
    paddingHorizontal: 4,
    minWidth: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default ProductsScreen;