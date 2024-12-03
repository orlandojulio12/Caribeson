// src/components/ArtistItem.js
import React, { useState, useEffect, useContext, memo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Share, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../AuthContext'; // Ajusta la ruta según tu estructura

const ArtistItem = ({ artist, navigation }) => {
  const { userId, userToken } = useContext(AuthContext);

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(true); // Indicador de carga

  useEffect(() => {
    if (userId && artist.id) {
      // Verificar si el usuario ha dado "Me gusta" al artista
      const fetchLikeStatus = async () => {
        try {
          const response = await fetch(`http://192.168.1.105/CONEXION/likes_check.php?usuario_id=${userId}&content_type=artista&content_id=${artist.id}`);
          const data = await response.json();
          setLiked(data.liked);
        } catch (error) {
          console.error('Error al verificar el estado de "Me gusta":', error);
        }
      };

      // Obtener el conteo de "Me gusta" del artista
      const fetchLikesCount = async () => {
        try {
          const response = await fetch(`http://192.168.1.105/CONEXION/likes_count.php?content_type=artista&content_id=${artist.id}`);
          const data = await response.json();
          setLikesCount(data.count);
        } catch (error) {
          console.error('Error al obtener el conteo de "Me gusta":', error);
        }
      };

      const initializeLikeData = async () => {
        await fetchLikeStatus();
        await fetchLikesCount();
        setLoading(false);
      };

      initializeLikeData();

      // Verificar la estructura de las canciones
      console.log("Datos de canciones:", artist.songs);
    }
  }, [userId, artist.id]);

  const handleLike = async () => {
    if (!userId) {
      Alert.alert('Error', 'Debes iniciar sesión para dar "Me gusta".');
      console.log("Usuario no autenticado");
      return;
    }

    const method = liked ? 'DELETE' : 'POST';
    const url = 'http://192.168.1.105/CONEXION/likes.php';

    console.log(`Método HTTP: ${method}`);
    console.log(`URL: ${url}`);
    console.log("Body de la solicitud:", {
      usuario_id: userId,
      content_type: 'artista',
      content_id: artist.id,
    });

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`, // Opcional: Añade el token si tu backend lo requiere
        },
        body: JSON.stringify({
          usuario_id: userId,
          content_type: 'artista',
          content_id: artist.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.success) {
          setLiked(!liked);
          setLikesCount(prevCount => (liked ? prevCount - 1 : prevCount + 1));
          console.log(`"Me gusta" ${liked ? 'quitaron' : 'añadieron'}. Nuevo estado: liked=${!liked}, likesCount=${liked ? likesCount - 1 : likesCount + 1}`);
          Alert.alert('Éxito', data.message);
        } else {
          // Manejar error
          console.error('Error del backend:', data.message);
          Alert.alert('Error', data.message || 'No se pudo actualizar el "Me gusta".');
        }
      } else {
        Alert.alert('Error', data.message || `Error HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Error de red o procesamiento:', error);
      Alert.alert('Error', 'Hubo un problema al actualizar el "Me gusta". Intenta de nuevo.');
    }
  };

  // Función para compartir información del artista
  const onShareArtist = async () => {
    try {
      const message = `Conoce más sobre ${artist.name}: ${artist.biography}`;
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContentContainer}
      nestedScrollEnabled={true}
    >
      <Image source={{ uri: artist.image }} style={styles.artistImage} />
      <Text style={styles.fuente}>{artist.source}</Text>

      <Text style={styles.artistName}>{artist.name}</Text>

      {/* Botón de "Me gusta" y conteo */}
      <View style={styles.likeContainer}>
        <TouchableOpacity onPress={handleLike}>
          <MaterialCommunityIcons
            name={liked ? 'heart' : 'heart-outline'}
            size={30}
            color={liked ? 'red' : 'gray'}
          />
        </TouchableOpacity>
        <Text style={styles.likesCount}>{likesCount}</Text>
      </View>

      {/* Botón de Compartir */}
      <TouchableOpacity style={styles.shareButton} onPress={onShareArtist}>
        <MaterialCommunityIcons name="share-outline" size={30} color="#000" />
        <Text style={styles.shareText}>Compartir</Text>
      </TouchableOpacity>

      <Text style={styles.biography}>{artist.biography}</Text>

      <Text style={styles.sectionTitle}>Canciones</Text>
      {artist.songs && artist.songs.length > 0 ? (
        <FlatList
          data={artist.songs}
          keyExtractor={(song, index) => song.id_cancion ? song.id_cancion.toString() : `${song.title}-${index}`} // Usar id_cancion
          renderItem={({ item: song, index }) => (
            <TouchableOpacity
              style={styles.songItem}
              onPress={() => {
                if (song.id_cancion) {
                  navigation.navigate('VideoFromYouTube', {
                    youtubeLink: song.link,
                    title: song.title,
                    songId: song.id_cancion,
                  });
                } else {
                  Alert.alert('Error', 'Esta canción no tiene un identificador válido.');
                }
              }}
            >
              <Text style={styles.songTitle}>{`${index + 1}. ${song.title}`}</Text>
            </TouchableOpacity>
          )}
          nestedScrollEnabled={true}
        />
      ) : (
        <Text style={styles.noSongs}>No hay canciones disponibles.</Text>
      )}
    </ScrollView>
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
    height: 300,
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
  songTitle: {
    fontSize: 16,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default memo(ArtistItem); // Usar React.memo para evitar re-renderizados innecesarios
