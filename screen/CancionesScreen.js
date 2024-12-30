import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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

const MusicPlayer = () => {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [songsPerPage] = useState(10); // Number of songs per page
  const navigation = useNavigation();

  useEffect(() => {
    fetch('https://caribeson.com/CONEXION/getCanciones.php')
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
    const filtered = query === '' ? songs : songs.filter(
      (song) => song.title.toLowerCase().includes(query.toLowerCase()) ||
                song.artist.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredSongs(filtered);
  };

  const handlePress = (song) => {
    navigation.navigate('VideoFromYouTube', { youtubeLink: song.link, title: song.title,songId:song.id });
  };

  const numPages = Math.ceil(filteredSongs.length / songsPerPage);
  const indexOfLastSong = currentPage * songsPerPage;
  const indexOfFirstSong = indexOfLastSong - songsPerPage;
  const currentSongs = filteredSongs.slice(indexOfFirstSong, indexOfLastSong);

  const goToPrevPage = () => {
    setCurrentPage(currentPage > 1 ? currentPage - 1 : 1);
  };

  const goToNextPage = () => {
    setCurrentPage(currentPage < numPages ? currentPage + 1 : numPages);
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Banner />
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={25} color="gray" />
        <TextInput
          style={styles.searchBar}
          placeholder="Buscar Cancion"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      {currentSongs.map((item) => (
        <MusicItem 
          key={item.id.toString()} 
          title={item.title} 
          artist={item.artist} 
          imageSource={item.foto || 'default_image_url'} 
          onPress={() => handlePress(item)}
        />
      ))}
      <View style={styles.paginationContainer}>
        <TouchableOpacity 
          style={[styles.paginationButton, { opacity: currentPage === 1 ? 0.5 : 1 }]}
          onPress={goToPrevPage}
          disabled={currentPage === 1}
        >
          <MaterialCommunityIcons name="chevron-left" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.paginationButton, { opacity: currentPage === numPages ? 0.5 : 1 }]}
          onPress={goToNextPage}
          disabled={currentPage === numPages}
        >
          <MaterialCommunityIcons name="chevron-right" size={30} color="black" />
        </TouchableOpacity>
      </View>
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
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  paginationButton: {
    padding: 10,
  },
});

export default MusicPlayer;
