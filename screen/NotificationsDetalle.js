import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

const NotificacionDetalle = ({ route }) => {
  const { item } = route.params;

  return (
    <ScrollView style={styles.container}>
      {item.foto && (
        <Image source={{ uri: item.foto }} style={styles.image} />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.date}>Fuente:  {item.fuente_foto}</Text>
        <Text style={styles.date}>{item.fecha}</Text>
        <Text style={styles.title}>{item.titulo}</Text>
        <Text style={styles.description}>{item.descripcion}</Text>
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
    marginBottom: 16,
    borderRadius: 10,
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
});

export default NotificacionDetalle;
