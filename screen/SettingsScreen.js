import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch, ScrollView } from 'react-native';
import { AuthContext } from './../AuthContext';
import { useNavigation } from '@react-navigation/native';
import Banner from './banner';
const SettingsScreen = () => {
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar sesión', onPress: async () => {
          await logout();
          navigation.reset({
            index: 0,
            routes: [{ name: 'PreLogin' }],
          });
        }},
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* <Text style={styles.title}>Configuración</Text> */}
      <Banner />
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PERMITIR QUE CARIBESON ACCEDA A</Text>
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Creditos')}>
          <Text style={styles.itemText}>Creditos</Text>
          <Text style={styles.itemSubText}></Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Notificaciones')}>
        <Text style={styles.itemText}>Notificaciones</Text>
        <Text style={styles.itemSubText}>On/Off</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('UpdateProfileScreen')}>
          <Text style={styles.itemText}>Actualizar Datos</Text>
          <Text style={styles.itemSubText}></Text>
        </TouchableOpacity>
      </View>
    
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    padding: 0,
    marginBottom: 15,
    marginTop: 0,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#888',
     textAlign: 'center',
  },
  item: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
  },
  itemSubText: {
    fontSize: 12,
    color: '#888',
  },
  button: {
    marginTop: 5,
    padding: 15,
    backgroundColor: '#D4281C',
    borderRadius: 40,
    alignItems: 'center',
    
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
