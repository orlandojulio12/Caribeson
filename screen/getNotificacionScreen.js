import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { AuthContext } from '../AuthContext'; 
import { useNavigation } from '@react-navigation/native';

const NotificationItem = ({ title, description, imageSource, date, onPress }) => {
  // Limita la descripción a un pequeño fragmento
  const truncatedDescription = description.length > 100 
    ? `${description.substring(0, 100)}...` 
    : description;

  return (
    <TouchableOpacity onPress={onPress} style={styles.notificationItem}>
      <Image source={{ uri: imageSource }} style={styles.notificationImage} />
      <View style={styles.notificationInfo}>
        <Text style={styles.notificationTitle}>{title}</Text>
        <Text style={styles.notificationDescription}>{truncatedDescription}</Text>
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.viewMoreText}>Ver más</Text>
        </TouchableOpacity>
        <Text style={styles.notificationDate}>{date}</Text>
      </View>
    </TouchableOpacity>
  );
};

const GetNotificaciones = () => {
  const { setNotificationCount } = useContext(AuthContext); 
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    // Reset notification count to 0 when user navigates to this screen
    setNotificationCount(0);

    // Fetch notifications
    fetch('https://www.caribeson.com/CONEXION/getNotificacion.php')
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
        return response.json();
      })
      .then((data) => {
        // Aseguramos que 'data' sea un arreglo
        if (Array.isArray(data)) {
          setNotifications(data);
        } else {
          setNotifications([]); // Si no es un arreglo, establecemos un arreglo vacío
        }
      })
      .catch((error) => {
        console.error('Error fetching notifications:', error);
        setError(error.message);
      });
  }, [setNotificationCount]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {error && <Text style={styles.errorText}>Error: {error}</Text>}
      {notifications.length === 0 && !error && (
        <Text style={styles.noNotificationsText}>No hay notificaciones pendientes</Text>
      )}
      {notifications.map((item, index) => (
        <NotificationItem
          key={index}
          title={item.titulo}
          description={item.descripcion}
          imageSource={item.foto || 'default_image_url'}
          date={item.fecha}
          onPress={() => navigation.navigate('NotificacionDetalle', { item })}
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
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  noNotificationsText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  notificationImage: {
    width: '40%',
    height: '100%',
    borderRadius: 8,
  },
  notificationInfo: {
    marginLeft: 10,
    flex: 1,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  notificationDescription: {
    fontSize: 14,
  },
  viewMoreText: {
    fontSize: 14,
    color: 'blue',
    marginTop: 5,
    textDecorationLine: 'underline',
  },
  notificationDate: {
    fontSize: 12,
    color: 'gray',
  },
});

export default GetNotificaciones;
