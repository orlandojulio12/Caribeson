import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from './../AuthContext';

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleRegister = async () => {
    if (!username || !correo || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (!validateEmail(correo)) {
      Alert.alert('Error', 'Por favor ingresa un correo electrónico válido');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres');
      return;
    }

    try {
      const response = await fetch('http://10.1.80.148/CONEXION/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: username,
          email: correo,
          password: password,
        }),
      });

      const responseText = await response.text();
      console.log('Respuesta del servidor:', responseText);

      const jsonStartIndex = responseText.indexOf('{');
      const jsonString = responseText.substring(jsonStartIndex);
      const data = JSON.parse(jsonString);

      if (data.success) {
        Alert.alert('Éxito', 'Registro exitoso');
        login(data.token); // Almacenar el token de usuario y actualizar el estado de autenticación
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        }); // Reiniciar la navegación y navegar a las pestañas principales
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema con el registro');
      console.error('Error:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ImageBackground source={require('./../assets/p2.webp')} style={styles.background}>
        <View style={styles.overlay}>
          <View style={styles.innerContainer}>
            <Image source={require("./../assets/logocaribe.png")} style={styles.logo} />
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Nombre Completo"
            />
            <TextInput
              style={styles.input}
              value={correo}
              onChangeText={setCorreo}
              placeholder="Correo Electrónico"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Contraseña"
              secureTextEntry
            />
            <TouchableOpacity style={styles.botonRegistrar} onPress={handleRegister}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Registrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  logo: {
    width: 250,
    height: 250,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13, 42, 103, 0.6)',
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 20,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#ffffffcc',
    paddingStart: 20,
  },
  botonRegistrar: {
    width: '80%',
    backgroundColor: '#D4281C',
    borderRadius: 22,
    height: 40,
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
