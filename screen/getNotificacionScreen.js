import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { AuthContext } from '../AuthContext'; 

const NotificationItem = ({ title, description, imageSource, date }) => (
  <View style={styles.notificationItem}>
    <Image source={{ uri: imageSource }} style={styles.notificationImage} />
    <View style={styles.notificationInfo}>
      <Text style={styles.notificationTitle}>{title}</Text>
      <Text style={styles.notificationDescription}>{description}</Text>
      <Text style={styles.notificationDate}>{date}</Text>
    </View>
  </View>
);

const GetNotificaciones = () => {
  const { setNotificationCount } = useContext(AuthContext); // Obtén setNotificationCount del contexto
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset notification count to 0 when user navigates to this screen
    setNotificationCount(0);

    // Fetch notifications
    fetch('http://10.1.80.148/CONEXION/getNotificacion.php')
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
        return response.json();
      })
      .then((data) => {
        setNotifications(data);
      })
      .catch((error) => {
        console.error('Error fetching notifications:', error);
        setError(error.message);
      });
  }, [setNotificationCount]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {error && <Text style={styles.errorText}>Error: {error}</Text>}
      {notifications.map((item, index) => (
        <NotificationItem
          key={index}
          title={item.titulo}
          description={item.descripcion}
          imageSource={item.foto || 'default_image_url'}
          date={item.fecha}
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
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  notificationImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  notificationInfo: {
    marginLeft: 10,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  notificationDescription: {
    fontSize: 14,
  },
  notificationDate: {
    fontSize: 12,
    color: 'gray',
  },
});

export default GetNotificaciones;
