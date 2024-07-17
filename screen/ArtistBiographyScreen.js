import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity,FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ArtistBiographyScreen = ({ route }) => {
  const { artist } = route.params;
  const navigation = useNavigation();

  const handlePress = (videoId) => {
    navigation.navigate('VideoFromYouTube', { videoId });
  };

  return (
    <FlatList
      style={styles.container}
      data={[artist]}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.innerContainer}>
          <Image source={{ uri: item.image }} style={styles.artistImage} />
          <Text style={styles.fuente}>{item.source}</Text>

          <Text style={styles.artistName}>{item.name}</Text>
          <Text style={styles.biography}>{item.biography}</Text>

          <Text style={styles.sectionTitle}>Canciones</Text>
          {item.songs && item.songs.length > 0 ? (
            <FlatList
              data={item.songs}
              keyExtractor={(song) => song.title}
              renderItem={({ item: song, index }) => (
                <TouchableOpacity
                  style={styles.songItem}
                  onPress={() => navigation.navigate('VideoFromYouTube', { youtubeLink: song.link , title: song.title})}
                >
                  <Text>{`${index + 1}. ${song.title}`}</Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text style={styles.noSongs}>No hay canciones disponibles.</Text>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
  },
  artistImage: {
    width: '100%',
    height: 300,
    borderRadius: 0,
    marginBottom: 16,
    borderRadius: 10,
  },
  container: {
    flex: 1,
  },
  innerContainer: {
    padding: 16,
  },
  artistName: {
    fontSize: 24,
    fontFamily: 'OleoScript',
    marginBottom: 8,
    marginTop: 15,
    color: 'red',
    textAlign: 'center', // Centramos el texto horizontalmente
  },
  
  fuente:{
    fontSize: 13,
    marginBottom: 8,
  },
  biography: {
    fontSize: 16,
    lineHeight: 25,
    marginBottom: 16,
    color: 'black',
    fontFamily: 'Montserrat',
    fontWeight: '700',
    textAlign: 'justify', 
  },
  sectionTitle: {
    fontSize: 25,
    color: 'red',
    marginBottom: 8,
    fontFamily: 'OleoScript',
  },
  songItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  noSongs: {
    fontSize: 16,
    fontStyle: 'italic',
    color: 'gray',
  },
});

export default ArtistBiographyScreen;
