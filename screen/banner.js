import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const { width: viewportWidth } = Dimensions.get('window');

const Banner = () => {
  return (
    <View style={styles.bannerContainer}>
      <Image
        source={require('./../assets/banner3.png')}
        style={styles.bannerImage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    width: viewportWidth,
    height: 170,
    marginBottom: 20,
  },
  bannerImage: {
    width: viewportWidth,
    height: '100%',
  },
});

export default Banner;
