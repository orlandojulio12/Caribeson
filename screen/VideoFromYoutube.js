import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Linking } from 'react-native';
import { WebView } from 'react-native-webview';

const VideoFromYouTube = ({ route }) => {
  const { youtubeLink, title } = route.params || {};

  if (!youtubeLink) {
    return (
      <View style={styles.container}>
        <Text>Error: No se proporcionó un enlace de YouTube.</Text>
      </View>
    );
  }

  const videoId = youtubeLink.split('v=')[1];
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  const handlePress = () => {
    Linking.openURL(`https://www.youtube.com/watch?v=${videoId}`);
  };

  return (
    <View style={styles.container}>
      <WebView
        style={{
          height: 300,
          width: Dimensions.get('window').width - 32,
        }}
        source={{ uri: embedUrl }}
        allowsFullscreenVideo
      />
      <Text style={styles.title}>Nombre: {title}</Text>
      <Text>Si el video no carga darle click aqui:</Text>
      <TouchableOpacity onPress={handlePress}>
        <Text style={styles.link}>{embedUrl}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default VideoFromYouTube;
