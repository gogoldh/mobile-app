import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSettings } from "../SettingsContext";

const SITE_ID = "68476f8832c1df493f86e175";
const COLLECTION_ID = "68476fe029a5470acb7439d1";
const API_TOKEN = "Bearer adef17688dc90e5678a80e42cb16858fab0fb9ea484d36f714b0e115a94c0af4";

const BlogsScreen = ({ navigation }) => {
  const { darkMode } = useSettings();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [showSearch, setShowSearch] = useState(false);
  const searchWidth = useState(new Animated.Value(0))[0];

  useEffect(() => {
    fetch(
      `https://api.webflow.com/v2/collections/${COLLECTION_ID}/items?site_id=${SITE_ID}`,
      {
        headers: {
          Authorization: API_TOKEN,
          "accept-version": "1.0.0",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data.items || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load blogs");
        setLoading(false);
      });
  }, []);

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

  // Filtering and sorting
  const filteredBlogs = blogs
    .filter((blog) =>
      (blog.fieldData?.name || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "date-desc") {
        return new Date(b.updatedOn || b.createdOn) - new Date(a.updatedOn || a.createdOn);
      }
      if (sortBy === "date-asc") {
        return new Date(a.updatedOn || a.createdOn) - new Date(b.updatedOn || b.createdOn);
      }
      if (sortBy === "alpha-asc") {
        return (a.fieldData?.name || "").localeCompare(b.fieldData?.name || "");
      }
      if (sortBy === "alpha-desc") {
        return (b.fieldData?.name || "").localeCompare(a.fieldData?.name || "");
      }
      return 0;
    });

  if (loading) {
    return (
      <View style={[styles.center, darkMode && { backgroundColor: "#181818" }]}>
        <ActivityIndicator size="large" color="#e53935" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, darkMode && { backgroundColor: "#181818" }]}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  if (!blogs.length) {
    return (
      <View style={[styles.center, darkMode && { backgroundColor: "#181818" }]}>
        <Text style={{ color: darkMode ? "#ffe066" : "#222" }}>Geen blogs gevonden.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, darkMode && { backgroundColor: "#181818" }]}>
      {/* Top bar with search and sort */}
      <View style={[
  styles.topBar,
  darkMode && { backgroundColor: "#222" }
]}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            style={[
              styles.iconButton,
              darkMode && { backgroundColor: "#222" },
            ]}
            onPress={() => setShowSearch((v) => !v)}
          >
            <Ionicons
              name={showSearch ? "close" : "search"}
              size={26}
              color={darkMode ? "#ffe066" : "#e53935"}
            />
          </TouchableOpacity>
          <Animated.View style={[styles.animatedSearch, { width: searchBarWidth }]}>
            {showSearch && (
              <TextInput
                autoFocus
                style={[
                  styles.searchInput,
                  darkMode && {
                    backgroundColor: "#222",
                    color: "#ffe066",
                    borderColor: "#444",
                  },
                ]}
                placeholder="Zoek blogs..."
                placeholderTextColor={darkMode ? "#bbb" : "#888"}
                value={search}
                onChangeText={setSearch}
                onBlur={() => setShowSearch(false)}
              />
            )}
          </Animated.View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* Sort by date */}
          <TouchableOpacity
            style={[
              styles.sortButton,
              darkMode && { backgroundColor: "#222" },
            ]}
            onPress={() =>
              setSortBy((prev) =>
                prev === "date-desc"
                  ? "date-asc"
                  : "date-desc"
              )
            }
          >
            <Ionicons
              name={sortBy === "date-desc" ? "time-outline" : "time"}
              size={24}
              color={sortBy.startsWith("date") ? (darkMode ? "#ffe066" : "#e53935") : (darkMode ? "#bbb" : "#888")}
            />
          </TouchableOpacity>
          {/* Sort alphabetically */}
          <TouchableOpacity
            style={[
              styles.sortButton,
              darkMode && { backgroundColor: "#222" },
            ]}
            onPress={() =>
              setSortBy((prev) =>
                prev === "alpha-asc"
                  ? "alpha-desc"
                  : "alpha-asc"
              )
            }
          >
            <Ionicons
              name={sortBy.startsWith("alpha") ? "text" : "text-outline"}
              size={24}
              color={sortBy.startsWith("alpha") ? (darkMode ? "#ffe066" : "#e53935") : (darkMode ? "#bbb" : "#888")}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Blog list */}
      <FlatList
        data={filteredBlogs}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const thumb = item.fieldData?.["thumbnail-image"]?.url;
          const main = item.fieldData?.["main-image"]?.url;
          return (
            <TouchableOpacity
              style={[
                styles.card,
                darkMode && {
                  backgroundColor: "#222",
                  borderColor: "#444",
                },
              ]}
              onPress={() => navigation.navigate("BlogDetailScreen", { blog: item })}
            >
              {thumb || main ? (
                <Image source={{ uri: thumb || main }} style={styles.image} />
              ) : (
                <View style={[styles.image, styles.placeholder]}>
                  <Ionicons name="image-outline" size={48} color={darkMode ? "#555" : "#bbb"} />
                </View>
              )}
              <Text style={[styles.title, darkMode && { color: "#ffe066" }]}>{item.fieldData?.name || "No title"}</Text>
              <Text style={[styles.summary, darkMode && { color: "#bbb" }]} numberOfLines={2}>
                {item.fieldData?.["post-summary"] || ""}
              </Text>
              <Text style={[styles.date, darkMode && { color: "#888" }]}>
                {item["lastUpdated"]
                  ? new Date(item["lastUpdated"]).toLocaleDateString()
                  : item["createdOn"]
                  ? new Date(item["createdOn"]).toLocaleDateString()
                  : ""}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
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
  searchInput: {
    flex: 1,
    backgroundColor: "#eee",
    color: "#333",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    marginLeft: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  sortButton: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 8,
    marginLeft: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: "#fff",
    marginBottom: 0,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  image: {
    width: "100%",
    height: 180,
    marginBottom: 10,
    backgroundColor: "#eee",
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 6,
    color: "#222",
  },
  summary: {
    color: "#555",
    fontSize: 14,
    marginBottom: 6,
  },
  date: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 2,
    textAlign: "right",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default BlogsScreen;