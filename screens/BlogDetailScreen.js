import React from "react";
import { View, Text, ScrollView, Image, StyleSheet, Dimensions, TouchableOpacity, Platform, StatusBar } from "react-native";
import RenderHtml from "react-native-render-html";
import { Ionicons } from "@expo/vector-icons";
import { useSettings } from "../SettingsContext";

const BlogDetailScreen = ({ route, navigation }) => {
  const { blog } = route.params;
  const { darkMode } = useSettings();
  const width = Dimensions.get("window").width;

  // Prefer thumbnail, fallback to main-image
  const thumb = blog.fieldData?.["thumbnail-image"]?.url;
  const main = blog.fieldData?.["main-image"]?.url;
  const imageUrl = thumb || main;

  // Use post-body for HTML content, fallback to summary
  const htmlContent = blog.fieldData?.["post-body"] || `<p>${blog.fieldData?.["post-summary"] || ""}</p>`;

  return (
    <View style={[{ flex: 1, backgroundColor: darkMode ? "#181818" : "#fff" }]}>
      {/* Custom topbar */}
      <View
        style={[
          styles.topBar,
          darkMode && { backgroundColor: "#181818" }
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={darkMode ? "#ffe066" : "#222"} />
        </TouchableOpacity>
        <Text style={[styles.topBarTitle, darkMode && { color: "#ffe066" }]}>Blog</Text>
      </View>
      <ScrollView contentContainerStyle={[styles.container, darkMode && { backgroundColor: "#181818" }]}>
        {imageUrl && (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        )}
        <Text style={[styles.title, darkMode && { color: "#ffe066" }]}>{blog.fieldData?.name || "No title"}</Text>
        <Text style={[styles.date, darkMode && { color: "#bbb" }]}>
          {blog.fieldData?.["post-date"]
            ? new Date(blog.fieldData["post-date"]).toLocaleDateString()
            : ""}
        </Text>
        <Text style={[styles.summary, darkMode && { color: "#bbb" }]}>{blog.fieldData?.["post-summary"] || ""}</Text>
        <View style={[styles.divider, darkMode && { backgroundColor: "#333" }]} />
        <RenderHtml
          contentWidth={width - 32}
          source={{ html: htmlContent }}
          tagsStyles={{
            h1: { fontSize: 22, fontWeight: "bold", marginVertical: 8, color: darkMode ? "#ffe066" : "#e53935" },
            h2: { fontSize: 18, fontWeight: "bold", marginVertical: 6, color: darkMode ? "#ffe066" : "#222" },
            p: { fontSize: 16, color: darkMode ? "#eee" : "#222", marginBottom: 8, lineHeight: 24 },
            ul: { marginBottom: 8, paddingLeft: 20 },
            li: { fontSize: 16, color: darkMode ? "#eee" : "#222", marginBottom: 4 },
          }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 32 : 32,
    paddingBottom: 8,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 0,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
    marginRight: 4,
  },
  topBarTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    marginLeft: 4,
  },
  container: {
    padding: 16,
    backgroundColor: "#fff",
    alignItems: "stretch",
  },
  image: {
    width: "100%",
    height: 220,
    marginBottom: 16,
    backgroundColor: "#eee",
    borderRadius: 12,
  },
  title: {
    fontWeight: "bold",
    fontSize: 26,
    marginBottom: 4,
    color: "#222",
  },
  date: {
    color: "#aaa",
    fontSize: 13,
    marginBottom: 8,
  },
  summary: {
    color: "#666",
    fontSize: 16,
    marginBottom: 16,
    fontStyle: "italic",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },
});

export default BlogDetailScreen;