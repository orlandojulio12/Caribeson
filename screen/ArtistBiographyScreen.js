// ArtistBiographyScreen.js
import React, { useRef, useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ScrollView, TouchableOpacity, Dimensions, Alert, Share } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../AuthContext'; // Asegúrate de importar el AuthContext

const { width } = Dimensions.get('window');

const ArtistBiographyScreen = ({ route }) => {
  const { artist, artists } = route.params;
  const { userId, userToken } = useContext(AuthContext); // Accede al userId y userToken desde el contexto
  console.log("El ID del usuario es:", userId);
  console.log("Artistas:", artists);

  const navigation = useNavigation();
  const flatListRef = useRef(null);

  // Estados para manejar 'liked' y 'likesCount' por cada artista
  const [liked, setLiked] = useState({});
  const [likesCount, setLikesCount] = useState({});
  const [currentArtistId, setCurrentArtistId] = useState(artist.id); // Inicializa con el artista pasado por ruta

  // Obtener el índice del artista actual
  const currentIndex = artists.findIndex(a => a.id === artist.id);
  console.log("id del artista", artist.id);

  useEffect(() => {
    if (userId && currentArtistId) {
      // Verificar si el usuario ha dado "Me gusta" al artista actual
      fetch(`http://192.168.1.119/CONEXION/likes_check.php?usuario_id=${userId}&content_type=artista&content_id=${currentArtistId}`)
        .then(response => response.json())
        .then(data => {
          setLiked(prevLiked => ({
            ...prevLiked,
            [currentArtistId]: data.liked
          }));
        })
        .catch(error => console.error('Error:', error));

      // Obtener el conteo de "Me gusta" del artista actual
      fetch(`http://192.168.1.119/CONEXION/likes_count.php?content_type=artista&content_id=${currentArtistId}`)
        .then(response => response.json())
        .then(data => {
          setLikesCount(prevLikesCount => ({
            ...prevLikesCount,
            [currentArtistId]: data.count
          }));
        })
        .catch(error => console.error('Error:', error));

      // Verificar la estructura de las canciones
      const currentArtist = artists.find(a => a.id === currentArtistId);
      if (currentArtist) {
        console.log("Datos de canciones:", currentArtist.songs);
      }
    }
  }, [userId, currentArtistId, artists]);

  const handleLike = () => {
    console.log("handleLike triggered");

    if (!userId) {
      Alert.alert('Error', 'Debes iniciar sesión para dar "Me gusta".');
      console.log("Usuario no autenticado");
      return;
    }

    console.log("Usuario autenticado:", userId);

    const isLiked = liked[currentArtistId] || false;
    const method = isLiked ? 'DELETE' : 'POST';
    const url = 'http://192.168.1.119/CONEXION/likes.php';

    console.log(`Método HTTP: ${method}`);
    console.log(`URL: ${url}`);
    console.log("Body de la solicitud:", {
      usuario_id: userId,
      content_type: 'artista',
      content_id: currentArtistId,
    });

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`, // Opcional: Añade el token si tu backend lo requiere
      },
      body: JSON.stringify({
        usuario_id: userId,
        content_type: 'artista',
        content_id: currentArtistId,
      }),
    })
      .then(response => {
        console.log("Respuesta HTTP recibida:", response);
        return response.json();
      })
      .then(data => {
        console.log("Datos de la respuesta:", data);
        if (data.success) {
          setLiked(prevLiked => ({
            ...prevLiked,
            [currentArtistId]: !isLiked
          }));
          setLikesCount(prevLikesCount => ({
            ...prevLikesCount,
            [currentArtistId]: isLiked ? (prevLikesCount[currentArtistId] || 1) - 1 : (prevLikesCount[currentArtistId] || 0) + 1
          }));
          console.log(`"Me gusta" ${isLiked ? 'quitaron' : 'añadieron'}. Nuevo estado: liked=${!isLiked}, likesCount=${isLiked ? (likesCount[currentArtistId] || 1) - 1 : (likesCount[currentArtistId] || 0) + 1}`);
        } else {
          // Manejar error
          console.error('Error del backend:', data.message);
          Alert.alert('Error', data.message || 'No se pudo actualizar el "Me gusta".');
        }
      })
      .catch(error => {
        console.error('Error de red o procesamiento:', error);
        Alert.alert('Error', 'Hubo un problema al actualizar el "Me gusta". Intenta de nuevo.');
      });
  };

  // Función para compartir información del artista
  const onShareArtist = async () => {
    try {
      const currentArtist = artists.find(a => a.id === currentArtistId);
      if (!currentArtist) {
        Alert.alert('Error', 'Artista no encontrado para compartir.');
        return;
      }
      const message = `Conoce más sobre ${currentArtist.name}: ${currentArtist.biography}`;
      const result = await Share.share({
        message,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Compartido con una actividad específica
          console.log('Compartido con actividad:', result.activityType);
        } else {
          // Compartido
          console.log('Contenido compartido');
        }
      } else if (result.action === Share.dismissedAction) {
        // Compartir descartado
        console.log('Compartir descartado');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al intentar compartir. Intenta de nuevo.');
      console.error('Error al compartir:', error.message);
    }
  };

  const renderItem = ({ item }) => (
    <ScrollView
      style={[styles.container, { width }]}
      contentContainerStyle={styles.scrollContentContainer}
      nestedScrollEnabled={true}
    >
      <Image source={{ uri: item.image }} style={styles.artistImage} />
      <Text style={styles.fuente}>{item.source}</Text>

      <Text style={styles.artistName}>{item.name}</Text>

      {/* Botón de "Me gusta" y conteo */}
      <View style={styles.likeContainer}>
        <TouchableOpacity onPress={handleLike}>
          <MaterialCommunityIcons
            name={liked[item.id] ? 'heart' : 'heart-outline'}
            size={30}
            color={liked[item.id] ? 'red' : 'gray'}
          />
        </TouchableOpacity>
        <Text style={styles.likesCount}>{likesCount[item.id] || 0}</Text>
      </View>

      {/* Botón de Compartir */}
      <TouchableOpacity style={styles.shareButton} onPress={onShareArtist}>
        <MaterialCommunityIcons name="share-outline" size={30} color="#000" />
        <Text style={styles.shareText}>Compartir</Text>
      </TouchableOpacity>

      <Text style={styles.biography}>{item.biography}</Text>

      <Text style={styles.sectionTitle}>Canciones</Text>
      {item.songs && item.songs.length > 0 ? (
        <FlatList
          data={item.songs}
          keyExtractor={(song, index) => song.id_cancion ? song.id_cancion.toString() : `${song.title}-${index}`} // Actualizado para usar id_cancion
          renderItem={({ item: song, index }) => (
            <TouchableOpacity
              style={styles.songItem}
              onPress={() => {
                if (song.id_cancion) {
                  navigation.navigate('VideoFromYouTube', {
                    youtubeLink: song.link,
                    title: song.title,
                    songId: song.id_cancion, // Usa id_cancion
                  });
                } else {
                  Alert.alert('Error', 'Esta canción no tiene un identificador válido.');
                }
              }}
            >
              <Text>{`${index + 1}. ${song.title}`}</Text>
            </TouchableOpacity>
          )}
          nestedScrollEnabled={true}
        />
      ) : (
        <Text style={styles.noSongs}>No hay canciones disponibles.</Text>
      )}
    </ScrollView>
  );

  // Callback para detectar el cambio de artista visible
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const visibleArtist = viewableItems[0].item;
      if (visibleArtist && visibleArtist.id !== currentArtistId) {
        setCurrentArtistId(visibleArtist.id);
      }
    }
  }).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50
  }).current;

  return (
    <FlatList
      ref={flatListRef}
      data={artists}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      initialScrollIndex={currentIndex}
      getItemLayout={(data, index) => ({ length: width, offset: width * index, index })}
      renderItem={renderItem}
      nestedScrollEnabled={true}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 16,
  },
  artistImage: {
    width: '100%',
    height: 600,
    marginBottom: 16,
    borderRadius: 10,
  },
  artistName: {
    fontSize: 24,
    fontFamily: 'Montserrat',
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 15,
    color: 'red',
    textAlign: 'center',
  },
  fuente: {
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
    fontWeight: '700',
    marginBottom: 8,
    fontFamily: 'Montserrat',
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
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'center',
  },
  likesCount: {
    marginLeft: 8,
    fontSize: 18,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'center',
  },
  shareText: {
    marginLeft: 8,
    fontSize: 18,
    color: '#000',
  },
});

export default ArtistBiographyScreen;
