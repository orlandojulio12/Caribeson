import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image, ImageBackground } from 'react-native';

const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        navigation.replace('MainTabs');
      }, 1000);
    });
  }, [fadeAnim]);

  return (
    <ImageBackground
      source={require('../assets/fondo.png')}
      style={styles.background}
    >
      <Animated.View style={{ ...styles.logoContainer, opacity: fadeAnim }}>
        <Image source={require('../assets/logocaribe.png')} style={styles.logo} />
        <Text style={styles.logoText}>Conoce la historia detrás de cada nota.</Text>
      </Animated.View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 280,
    height: 210,
  },
  logoText: {
    marginTop: 15,
    fontSize: 44,
    fontWeight: '700',
    color: 'white',
    fontFamily: 'Montserrat',
    textAlign: 'center',
  },
});

export default SplashScreen;
