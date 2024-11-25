import React, { useContext, useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Image } from "react-native";
import axios from "axios";
import { AuthContext } from "./../AuthContext";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function UpdateProfileScreen() {
  const { userId } = useContext(AuthContext);
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleUpdate = async () => {
    if (!email && !password) {
      Alert.alert("Error", "Debes ingresar al menos un campo para actualizar.");
      return;
    }

    // Prepara los datos que quieres enviar
    const data = { id_usuario: userId };
    if (email) data.correo = email;
    if (password) data.contrasena = password;

    try {
      const response = await axios.post("https://www.caribeson.com/CONEXION/update_user.php", data);
  
      if (response.data.success) {
        Alert.alert("Éxito", "Tus datos han sido actualizados.");
        navigation.navigate("Caribeson");
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      console.error("Error al actualizar datos:", error);
      Alert.alert("Error", "Hubo un problema al actualizar tus datos. Intenta de nuevo.");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("./../assets/logocaribe.png")} style={styles.logo} />

      <Text style={styles.label}>Nuevo Correo Electrónico:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu nuevo correo"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Nueva Contraseña:</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Ingresa tu nueva contraseña"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.showPasswordButton}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons
            name={showPassword ? "eye" : "eye-off"}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Actualizar Datos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 30,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: "80%",
    height: 250,
    resizeMode: "contain",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  input: {
    width: "100%",
    height: 45,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 45,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  inputPassword: {
    flex: 1,
    paddingHorizontal: 10,
    height: "100%",
  },
  showPasswordButton: {
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#D4281C",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
