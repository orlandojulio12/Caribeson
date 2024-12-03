// VideoFromYouTube.js
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Linking, Alert, Share } from 'react-native';
import { WebView } from 'react-native-webview';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../AuthContext'; // Asegúrate de la ruta correcta

const VideoFromYouTube = ({ route }) => {
  const { youtubeLink, title, songId } = route.params || {};
  const { userId, userToken } = useContext(AuthContext); // Accede al userId y userToken desde el contexto

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

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

  useEffect(() => {
    if (userId && songId) {
      // Verificar si el usuario ha dado "Me gusta" a la canción
      const checkLikeStatus = async () => {
        try {
          const response = await fetch(`http://192.168.1.119/CONEXION/likes_check.php?usuario_id=${userId}&content_type=cancion&content_id=${songId}`);
          const data = await response.json();
          setLiked(data.liked);
        } catch (error) {
          console.error('Error:', error);
        }
      };

      // Obtener el conteo de "Me gusta" de la canción
      const fetchLikesCount = async () => {
        try {
          const response = await fetch(`http://192.168.1.119/CONEXION/likes_count.php?content_type=cancion&content_id=${songId}`);
          const data = await response.json();
          setLikesCount(data.count);
        } catch (error) {
          console.error('Error:', error);
        }
      };

      checkLikeStatus();
      fetchLikesCount();
    }
  }, [userId, songId]);

  const handleLike = async () => {
    if (!userId) {
      Alert.alert('Error', 'Debes iniciar sesión para dar "Me gusta".');
      console.log("Usuario no autenticado");
      return;
    }

    const method = liked ? 'DELETE' : 'POST';
    const url = 'http://192.168.1.119/CONEXION/likes.php';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`, // Opcional: Descomenta si tu backend lo requiere
        },
        body: JSON.stringify({
          usuario_id: userId,
          content_type: 'cancion',
          content_id: songId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.success) {
          setLiked(!liked);
          setLikesCount(prevCount => (liked ? prevCount - 1 : prevCount + 1));
          Alert.alert('Éxito', data.message);
        } else {
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

  // Función para compartir información de la canción
  const onShareSong = async () => {
    try {
      const message = `Escucha "${title}" en YouTube: ${youtubeLink}`;
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
      <TouchableOpacity style={styles.shareButton} onPress={onShareSong}>
        <MaterialCommunityIcons name="share-outline" size={30} color="#000" />
        <Text style={styles.shareText}>Compartir</Text>
      </TouchableOpacity>

      <Text>Si el video no carga, dale click aquí:</Text>
      <TouchableOpacity onPress={handlePress}>
        <Text style={styles.link}>{embedUrl}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  likesCount: {
    marginLeft: 8,
    fontSize: 18,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  shareText: {
    marginLeft: 8,
    fontSize: 18,
    color: '#000',
  },
});

export default VideoFromYouTube;
