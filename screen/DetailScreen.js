// DetailScreen.js
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Share } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../AuthContext'; // Asegúrate de la ruta correcta

const DetailScreen = ({ route }) => {
  const { item } = route.params; // Solo necesitas 'item' aquí
  const { userId, userToken } = useContext(AuthContext); // Accede al userId y userToken desde el contexto

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    if (userId && item.id_dato) {
      // Verificar si el usuario ha dado "Me gusta" al dato curioso
      const checkLikeStatus = async () => {
        try {
          const response = await fetch(`http://192.168.1.119/CONEXION/likes_check.php?usuario_id=${userId}&content_type=dato_curioso&content_id=${item.id_dato}`);
          const data = await response.json();
          setLiked(data.liked);
        } catch (error) {
          console.error('Error:', error);
        }
      };

      // Obtener el conteo de "Me gusta" del dato curioso
      const fetchLikesCount = async () => {
        try {
          const response = await fetch(`http://192.168.1.119/CONEXION/likes_count.php?content_type=dato_curioso&content_id=${item.id_dato}`);
          const data = await response.json();
          setLikesCount(data.count);
        } catch (error) {
          console.error('Error:', error);
        }
      };

      checkLikeStatus();
      fetchLikesCount();

      // Verificar la estructura de las canciones (si aplica)
      console.log("Datos de canciones:", item.songs);
    }
  }, [userId, item.id_dato]);

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
          content_type: 'dato_curioso',
          content_id: item.id_dato,
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

  // Función para compartir información del dato curioso
  const onShareDatoCurioso = async () => {
    try {
      const message = `Dato Curioso: "${item.dato_curioso}". Descubre más aquí: http://tuapp.com/datos/${item.id_dato}`;
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
    <ScrollView style={styles.container}>
      {item.foto && (
        <Image source={{ uri: item.foto }} style={styles.image} />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.date}>{item.fecha}</Text>
        <Text style={styles.title}>{item.titulo}</Text>

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
        <TouchableOpacity style={styles.shareButton} onPress={onShareDatoCurioso}>
          <MaterialCommunityIcons name="share-outline" size={30} color="#000" />
          <Text style={styles.shareText}>Compartir</Text>
        </TouchableOpacity>

        <Text style={styles.description}>{item.dato_curioso}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 16,
  },
  textContainer: {
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E86A1D',
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 25,
    marginBottom: 16,
    color: 'black',
    fontFamily: 'Montserrat',
    fontWeight: '700',
    textAlign: 'justify',
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

export default DetailScreen;
