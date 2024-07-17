import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const ImageFromURL = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Imagen desde una URL</Text>
      <Image
        style={styles.image}
        source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg3aqVU0vYRgiAkbYc3nYJ6OMHOX7e5W7iECrfVDCDJw&s' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
});

export default ImageFromURL;
