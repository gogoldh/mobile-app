import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSettings } from '../SettingsContext';
import translations from '../translations';

const Hero = () => {
  const navigation = useNavigation();
  const { language, darkMode } = useSettings();
  const t = translations[language];

  return (
    <ImageBackground
      source={require('../assets/circus-171-1.jpg')}
      style={styles.hero}
      resizeMode="cover"
    >
      <View style={[styles.overlay, darkMode && { backgroundColor: 'rgba(0,0,0,0.7)' }]} />
      <View style={styles.content}>
        <Text style={[styles.title, darkMode && { color: '#ffe066' }]}>
          Circus Brouwerij
        </Text>
        <Text style={[styles.subtitle, darkMode && { color: '#ffe066' }]}>
          {language === "nl" ? "Nu in de winkel" : "Now in stores"}
        </Text>
        <TouchableOpacity
          style={[
            styles.button,
            darkMode
              ? { backgroundColor: "#ffe066" }
              : { backgroundColor: "#333" }
          ]}
          onPress={() => navigation.navigate("Products")}
        >
          <Text style={[
            styles.buttonText,
            darkMode
              ? { color: "#333" }
              : { color: "#ffe066" }
          ]}>
            {language === "nl" ? "Bekijk alle producten" : "View all products"}
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  hero: {
    width: '120%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 30,
    borderRadius: 0,
    overflow: 'hidden',
    marginLeft: -40,
    marginTop: -20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  content: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1.5,
    fontFamily: 'monospace',
    marginTop: 20,
  },
  subtitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  button: {
    marginTop: 18,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 24,
    elevation: 2,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
});

export default Hero;