import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Banner from './banner';

const MusicItem = ({ title, artist, imageSource, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.musicItem}>
      <Image source={{ uri: imageSource }} style={styles.musicImage} />
      <View style={styles.musicInfo}>
        <Text style={styles.musicTitle}>{title}</Text>
        <Text style={styles.musicArtist}>{artist}</Text>
      </View>
      <View style={styles.musicActions}>
        <TouchableOpacity>
          <Text style={styles.musicActionText}>....</Text>
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);

const MusicPlayer = () => {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    fetch('http://10.1.80.148/CONEXION/getCanciones.php')
      .then((response) => response.json())
      .then((data) => {
        setSongs(data);
        setFilteredSongs(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredSongs(songs);
    } else {
      const filtered = songs.filter(
        (song) =>
          song.title.toLowerCase().includes(query.toLowerCase()) ||
          song.artist.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSongs(filtered);
    }
  };

  const handlePress = (song) => {
    navigation.navigate('VideoFromYouTube', { youtubeLink: song.link, title: song.title });
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
          placeholder="Buscar Cancion"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      {filteredSongs.map((item) => (
        <MusicItem 
          key={item.id.toString()} 
          title={item.title} 
          artist={item.artist} 
          imageSource={item.foto || 'default_image_url'} 
          onPress={() => handlePress(item)}
        />
      ))}
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
});

export default MusicPlayer;
