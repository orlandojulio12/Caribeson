import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Banner from './banner';

const MusicItem = ({ title, artist, imageSource, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.musicItem}>
      <Image source={{ uri: imageSource }} style={styles.musicImage} />
      <View style={styles.musicInfo}>
        <Text style={styles.musicTitle}>{title}</Text>
        <Text style={styles.musicArtist}>{artist}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const CancionesCategoria = () => {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { categoryId } = route.params;

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const url = `https://caribeson.com/CONEXION/getCancionesCategoria.php?categoria=${categoryId}`;
        const response = await fetch(url);
        const data = await response.json();
        if (Array.isArray(data)) {
          setSongs(data);
          setFilteredSongs(data); // Inicialmente, todas las canciones están sin filtrar
        } else {
          setSongs([]);
          setFilteredSongs([]);
        }
      } catch (error) {
        console.error('Failed to fetch songs:', error);
      }
    };

    fetchSongs();
  }, [categoryId]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredSongs(songs); // Si no hay query, muestra todas las canciones
    } else {
      const filtered = songs.filter(song =>
        (song.nombre?.toLowerCase().includes(query.toLowerCase()) ||
        song.artista?.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredSongs(filtered); // Actualiza con los resultados filtrados
    }
  };
  

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View>
        <Banner />
      </View>
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={25} color="gray" />
        <TextInput
          style={styles.searchBar}
          placeholder="Buscar Canción"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      {filteredSongs.length > 0 ? (
        filteredSongs.map((item, index) => (
          <MusicItem 
            key={index.toString()} 
            title={item.nombre} 
            artist={item.artista} 
            imageSource={item.foto || 'default_image_url'} 
            onPress={() => navigation.navigate('VideoFromYouTube', { youtubeLink: item.link_cancion, title: item.nombre })}
          />
        ))
      ) : (
        <Text style={styles.noSongsText}>No se encontraron canciones.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
    paddingHorizontal: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    marginLeft: 10,
  },
  musicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  musicImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  musicInfo: {
    marginLeft: 10,
  },
  musicTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D2A67',
  },
  musicArtist: {
    fontSize: 14,
  },
  musicActions: {
    marginLeft: 'auto',
  },
  musicActionText: {
    fontSize: 18,
  },
  noSongsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
});

export default CancionesCategoria;
