// components/Footer.js
import React from "react";
import { View, Text, StyleSheet, Image, Linking, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const Footer = () => {
  return (
    <View style={styles.footer}>
      <Image
        source={require("../assets/icon.png")} // Use a white version of your logo
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.text}>Circus Brouwerij</Text>
          <Text style={styles.text}>info@circusbrouwerij.be</Text>
          <Text style={styles.text}>Antwerpen, België</Text>
          <Text style={styles.text}>BE123.456.789</Text>
        </View>

        <View style={styles.column}>
          <Text style={styles.link} onPress={() => Linking.openURL("#")}>
            Over ons
          </Text>
          <Text style={styles.link} onPress={() => Linking.openURL("#")}>
            Shop
          </Text>
          <Text style={styles.link} onPress={() => Linking.openURL("#")}>
            Contact
          </Text>
        </View>

        <View style={styles.column}>
          <View style={styles.socialRow}>
            <TouchableOpacity onPress={() => Linking.openURL("https://www.facebook.com")}>
              <FontAwesome name="facebook-square" size={24} color="white" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL("https://www.instagram.com")}>
              <FontAwesome name="instagram" size={24} color="white" style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Text style={styles.copyright}>© {new Date().getFullYear()} Circus Brouwerij</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: "#000",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  logo: {
    height: 40,
    width: 160,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  column: {
    flex: 1,
  },
  text: {
    color: "#fff",
    marginBottom: 6,
  },
  link: {
    color: "#fff",
    marginBottom: 6,
    textDecorationLine: "underline",
  },
  socialRow: {
    flexDirection: "row",
    gap: 12,
  },
  icon: {
    marginRight: 10,
  },
  copyright: {
    color: "#aaa",
    fontSize: 12,
    textAlign: "center",
    marginTop: 10,
  },
});

export default Footer;
