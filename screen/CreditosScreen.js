import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const CreditsScreen = () => {
  const openLink = (url) => {
    Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../assets/logocaribe.png')} // Cambia a la ruta correcta de tu logo
        style={styles.logo}
      />

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Investigación y construcción narrativa:</Text>
        <Text style={styles.text}>Angela Marín Niebles</Text>
        <Text style={styles.text}>Grupo de investigación Sapiencia Arte y Música</Text>
        <Text style={styles.text}>Facultad de Bellas Artes</Text>
        <Text style={styles.text}>Barranquilla</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Experto en Tecnologías Virtuales:</Text>
        <Text style={styles.sectionTitle}>Tecnoparque Atlántico</Text>
        <Text style={styles.text}>Alexander Donado Molinares</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Colaboradores:</Text>
        <Text style={styles.text}>Andrea Trujillo Sarmiento</Text>
        <Text style={styles.text}>Manuel Camargo Pérez</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Desarrollado por:</Text>
        <TouchableOpacity style={styles.linkContainer} onPress={() => openLink('https://github.com/orlandojulio12')}>
          <FontAwesome name="github" size={24} color="#1e90ff" style={styles.icon} />
          <Text style={styles.linkText}>Orlando Jr Julio</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Diseño:</Text>
        <TouchableOpacity style={styles.linkContainer} onPress={() => openLink('https://www.behance.net/gallery/195593555/portfolio')}>
          <FontAwesome name="folder-open" size={24} color="#1e90ff" style={styles.icon} />
          <Text style={styles.linkText}>Masiel Rueda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkContainer} onPress={() => openLink('https://www.behance.net/gallery/201517549/portfolio')}>
          <FontAwesome name="folder-open" size={24} color="#1e90ff" style={styles.icon} />
          <Text style={styles.linkText}>Saray Martínez</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Colaboradores en Desarrollo:</Text>
        <TouchableOpacity style={styles.linkContainer} onPress={() => openLink('https://github.com/Josetapia23')}>
          <FontAwesome name="github" size={24} color="#1e90ff" style={styles.icon} />
          <Text style={styles.linkText}>Jose Tapia</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Tecnologías Utilizadas:</Text>
        <Text style={styles.text}>React Native</Text>
        <Text style={styles.text}>Expo</Text>
        <Text style={styles.text}>PHP</Text>
      </View>

      <Text style={styles.footerText}>
        © 2024 Universidad del Atlántico, Vicerrectoría de Investigaciones, Extensión y Proyección Social.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  logo: {
    width: 120,
    height: 100,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Para Android
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#2c3e50',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: '#34495e',
    marginBottom: 5,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  icon: {
    marginRight: 10,
  },
  linkText: {
    fontSize: 16,
    color: '#1e90ff',
    textDecorationLine: 'underline',
  },
  footerText: {
    fontSize: 14,
    color: 'gray',
    marginTop: 30,
    textAlign: 'center',
  },
});

export default CreditsScreen;
