import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, Text, ImageBackground, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from './../AuthContext';
import * as Facebook from 'expo-facebook';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login, userToken } = useContext(AuthContext); // Obtener userToken del contexto
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      navigation.navigate('PreLogin');
    });

    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    console.log('Iniciar sesión presionado');
    if (email.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }
    
    try {
      const response = await axios.post('http://10.1.80.148/CONEXION/login.php', {
        email: email,
        password: password
      }, {
        responseType: 'json'
      });

      if (response.status === 200 && response.data === "Conexión exitosa1") {
        console.log("esto",response.data);
        await login("user_token"); // Guarda un token de usuario (puedes reemplazar "user_token" con un token real)
        navigation.navigate('Caribeson');
      } else {
        console.log("esto2",response.data);
        Alert.alert('Error', "Credenciales Incorrectas");
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      Alert.alert('Error', 'Hubo un problema al intentar iniciar sesión. Por favor intenta de nuevo más tarde.');
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await Facebook.initializeAsync({
        appId: '1480861579185375',
      });

      const { type, token } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile', 'email'],
      });

      if (type === 'success') {
        await login(token); // Guardar el token de acceso de Facebook en el contexto
        navigation.navigate('Caribeson');
      } else {
        Alert.alert('Error', 'Inicio de sesión con Facebook cancelado');
      }
    } catch (error) {
      console.error('Error al iniciar sesión con Facebook:', error);
      Alert.alert('Error', 'Hubo un problema al intentar iniciar sesión con Facebook. Por favor intenta de nuevo más tarde.');
    }
  };

  return (
    <ImageBackground source={require('./../assets/p2.webp')} style={styles.background}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Image
            source={require("./../assets/logocaribe.png")}
            style={styles.logo}
          />
          {/* <Text style={styles.titulo}>Caribeson</Text> */}
          <TextInput
            style={styles.input}
            placeholder="Correo Electrónico"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.botonLogin}
            onPress={handleLogin}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Iniciar sesión</Text>
          </TouchableOpacity>
          {/* <Text style={styles.OR}>OR</Text>
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin}>
              <Image source={require('./../assets/Faacebook.webp')} style={styles.socialIcon} />
            </TouchableOpacity>
            <Text style={styles.separator}>|</Text>
            <TouchableOpacity style={styles.socialButton}>
              <Image source={require('./../assets/google_icon.png')} style={styles.socialIcon} />
            </TouchableOpacity>
          </View> */}

        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  logo: {
    width: 265,
    height: 260,
    // marginBottom: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13, 42, 103, 0.6)',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 20,
    paddingHorizontal: 10,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#fffFFFC2',
  },
  OR: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  titulo: {
    fontSize: 50,
    color: '#fff',
    fontFamily: "OleoScript",
    marginBottom: 30,
  },
  botonLogin: {
    width: '80%',
    height: 50,
    borderRadius: 20,
    marginTop: 15,
    marginBottom: 10,
    backgroundColor: '#D4281C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 0,
  },
  socialButton: {
    backgroundColor: '#fffFFFC2',
    width: 50,
    height: 50,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  socialIcon: {
    width: 30,
    height: 30,
  },
  separator: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 40,
  },
  botonRegistrar: {
    width: '40%',
    height: 50,
    borderRadius: 25,
    marginTop: 20,
    backgroundColor: '#d97f30',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
