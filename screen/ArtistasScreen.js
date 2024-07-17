import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Banner from './banner';

const ArtistsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [artists, setArtists] = useState([]);
  const [currentLetter, setCurrentLetter] = useState('');
  const [showLetterIndicator, setShowLetterIndicator] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const artistsPerPage = 2; // Mostrar dos artistas por página
  const navigation = useNavigation();

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await fetch('http://10.1.80.148/CONEXION/getArtistas.php');
        if (!response.ok) {
          throw new Error('Error al obtener los datos de artistas');
        }
        const data = await response.json();
        setArtists(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchArtists();
  }, []);

  const filteredArtists = artists.filter(artist =>
    artist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

// Función para dividir el array de artistas en grupos (chunks) según el número especificado por página
  const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };
// División de los artistas filtrados en chunks (grupos) de tamaño artistsPerPage
  const artistChunks = chunkArray(filteredArtists, artistsPerPage);

 // Manejador de evento de desplazamiento en la lista de artistas
  const handleScroll = (event) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    const index = Math.floor(yOffset / 100);
    if (filteredArtists.length > 0) {
      const letter = filteredArtists[index]?.name[0]?.toUpperCase();
      if (letter && letter !== currentLetter) {
        setCurrentLetter(letter);
        setShowLetterIndicator(true);
      }
    }
  };
// Manejador de evento al finalizar el desplazamiento
  const handleScrollEnd = () => {
    setShowLetterIndicator(false);
  };
// Función para avanzar a la siguiente página de artistas
  const goToNextPage = () => {
    setCurrentPage(currentPage + 1);
  };
  
  // Función para retroceder a la página anterior de artistas
  const goToPrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  // Componente de pantalla con ScrollView para mostrar los artistas y la paginación
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      onScroll={handleScroll}
      onMomentumScrollEnd={handleScrollEnd}
      scrollEventThrottle={16}
    >
      <View>
        <Banner />
      </View>
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={25} color="gray" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar artistas"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {showLetterIndicator && (
        <View style={styles.letterIndicatorContainer}>
          <Text style={styles.letterIndicatorText}>{currentLetter}</Text>  
        </View>
      )}

      {artistChunks.map((chunk, index) => (
        <View key={index} style={styles.artistRow}>
          {chunk.map(artist => (
            <TouchableOpacity
              key={artist.id} 
              style={styles.artistContainer}
              onPress={() => navigation.navigate('Biografia', { artist })}
            >
              <ImageBackground
                source={require('../assets/vinilo-artistas.png')}
                style={styles.backgroundImage}
              >
                <Image source={{ uri: artist.image }} style={styles.artistImage} />
              </ImageBackground>
              <Text style={styles.artistName}>{artist.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      {/* Controles de paginación */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity 
          style={[styles.paginationButton, { opacity: currentPage === 1 ? 0.5 : 1 }]}
          onPress={goToPrevPage}
          disabled={currentPage === 1}
        >
          <MaterialCommunityIcons name="chevron-left" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.paginationButton, { opacity: artistChunks.length < artistsPerPage ? 0.5 : 1 }]}
          onPress={goToNextPage}
          disabled={artistChunks.length < artistsPerPage}
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
  searchBarContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 18,
  },
  letterIndicatorContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 5,
    padding: 5,
  },
  letterIndicatorText: {
    color: 'white',
    fontSize: 20,
  },
  artistRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  artistContainer: {
    alignItems: 'center',
    width: '48%', // Ajusta el ancho para mostrar dos artistas en una fila con un pequeño espacio entre ellos
    padding: 10,
  },
  backgroundImage: {
    width: 250,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  artistImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    marginLeft: 10,
    marginTop: 10,
  },
  artistName: {
    marginTop: 8,
    textAlign: 'center',
    color: 'black',
    fontFamily: 'Montserrat',
    fontWeight: '700',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  paginationButton: {
    padding: 10,
  },
});

export default ArtistsScreen;
