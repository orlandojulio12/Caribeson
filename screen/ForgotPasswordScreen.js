// Screens/ForgotPasswordScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';

export default function ForgotPasswordScreen({ navigation }) {
  const [correo, setEmail] = useState('');

  const handlePasswordReset = async () => {
    try {
      const response = await fetch('https://caribeson.com/CONEXION/password_reset_request.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo }),
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert('Éxito', 'Revisa tu correo para restablecer la contraseña.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', data.message || 'No se pudo enviar el correo de recuperación.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema en la solicitud.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        value={correo}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
        <Text style={styles.buttonText}>Enviar Solicitud</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  input: { width: '100%', padding: 10, marginVertical: 10, borderWidth: 1, borderRadius: 5 },
  button: { backgroundColor: '#D4281C', padding: 15, borderRadius: 5, width: '100%', alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
