import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch, Image, Alert } from "react-native";
import { useSettings } from "../SettingsContext";
import { useProfile } from "../ProfileContext";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";

const translations = {
  nl: {
    profile: "Profiel & Instellingen",
    language: "Taal",
    dutch: "Nederlands",
    english: "Engels",
    darkmode: "Donkere modus",
    notifications: "Notificaties",
    back: "Terug",
    orderHistory: "Bestelgeschiedenis",
    tapToChange: "Tik op de foto om te wijzigen",
  },
  en: {
    profile: "Profile & Settings",
    language: "Language",
    dutch: "Dutch",
    english: "English",
    darkmode: "Dark mode",
    notifications: "Notifications",
    back: "Back",
    orderHistory: "Order History",
    tapToChange: "Tap photo to change",
  },
};

const ProfileScreen = ({ navigation }) => {
  const {
    language,
    setLanguage,
    darkMode,
    setDarkMode,
    notifications,
    setNotifications,
  } = useSettings();

  const { profileImage, setProfileImage } = useProfile();
  const t = translations[language];

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Toegang vereist", "Toegang tot foto's is vereist!");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <View style={[styles.container, darkMode && { backgroundColor: "#222" }]}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back-ios" size={24} color={darkMode ? "#fff" : "#333"} />
        <Text style={[styles.backText, darkMode && { color: "#fff" }]}>{t.back}</Text>
      </TouchableOpacity>

      <Text style={[styles.heading, darkMode && { color: "#fff" }]}>{t.profile}</Text>

      {/* Profielfoto */}
      <TouchableOpacity onPress={pickImage} style={{ alignSelf: "center", marginBottom: 16 }}>
        <Image
          source={
            profileImage
              ? { uri: profileImage }
              : require("../assets/default-profile.jpg")
          }
          style={styles.avatar}
        />
        <Text style={[styles.tapToChange, darkMode && { color: "#ffe066" }]}>{t.tapToChange}</Text>
      </TouchableOpacity>

      {/* Language selection */}
      <Text style={[styles.label, darkMode && { color: "#fff" }]}>{t.language}</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.languageButton,
            language === "nl" && styles.languageButtonActive,
          ]}
          onPress={() => setLanguage("nl")}
        >
          <Text style={language === "nl" ? styles.languageTextActive : styles.languageText}>{t.dutch}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.languageButton,
            language === "en" && styles.languageButtonActive,
          ]}
          onPress={() => setLanguage("en")}
        >
          <Text style={language === "en" ? styles.languageTextActive : styles.languageText}>{t.english}</Text>
        </TouchableOpacity>
      </View>

      {/* Dark mode toggle */}
      <View style={styles.settingRow}>
        <Text style={[styles.label, darkMode && { color: "#fff" }]}>{t.darkmode}</Text>
        <View style={styles.switchContainer}>
          <Icon name="dark-mode" size={22} color={darkMode ? "#fff" : "#333"} style={{ marginRight: 8 }} />
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: "#bbb", true: "#333" }}
            thumbColor={darkMode ? "#fff" : "#333"}
          />
        </View>
      </View>

      {/* Notifications toggle */}
      <View style={styles.settingRow}>
        <Text style={[styles.label, darkMode && { color: "#fff" }]}>{t.notifications}</Text>
        <View style={styles.switchContainer}>
          <Icon name="notifications-active" size={22} color={notifications ? "#e53935" : "#bbb"} style={{ marginRight: 8 }} />
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: "#bbb", true: "#e53935" }}
            thumbColor={notifications ? "#fff" : "#333"}
          />
        </View>
      </View>

      <TouchableOpacity
        style={{ marginTop: 24, backgroundColor: darkMode ? "#ffe066" : "#333", padding: 14, borderRadius: 8 }}
        onPress={() => navigation.navigate("Orders")}
      >
        <Text style={{ color: darkMode ? "#333" : "#fff", fontWeight: "bold", fontSize: 16 }}>
          {t.orderHistory}
        </Text>
      </TouchableOpacity>
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
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#eee",
    alignSelf: "center",
    marginBottom: 4,
  },
  tapToChange: {
    textAlign: "center",
    fontSize: 14,
    color: "#888",
    marginTop: 4,
    marginBottom: 8,
  },
  label: { fontSize: 16, marginBottom: 8 },
  row: { flexDirection: "row", marginBottom: 24 },
  languageButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#eee",
    marginRight: 12,
  },
  languageButtonActive: {
    backgroundColor: "#333",
  },
  languageText: {
    color: "#333",
    fontWeight: "bold",
  },
  languageTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
});

export default ProfileScreen;