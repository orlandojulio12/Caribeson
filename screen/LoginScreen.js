import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { AuthContext } from "./../AuthContext";
import Ionicons from "react-native-vector-icons/Ionicons"; // Importa los iconos de Ionicons

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login, userToken } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Estado para alternar visibilidad de contraseña

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      navigation.navigate("PreLogin");
    });

    return unsubscribe;
  }, [navigation]);

  const handleLogin = async () => {
    if (email.trim() === "" || password.trim() === "") {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://192.168.128.85/CONEXION/login.php",
        {
          email: email,
          password: password,
        },
        {
          responseType: "json",
        }
      );
      console.log("Respuesta del servidor:", response.data); 
      if (response.status === 200 && response.data.success) {
        const userId = response.data.userId;
        await login("user_token", userId); // Pasa userId a la función login
        navigation.navigate("Caribeson");
      } else {
        console.log("esto2", response.data);
        Alert.alert("Error", "Credenciales Incorrectas");
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      Alert.alert(
        "Error",
        "Hubo un problema al intentar iniciar sesión. Por favor intenta de nuevo más tarde."
      );
    }
  };
  

  return (
    <ImageBackground
      source={require("./../assets/fondo.png")}
      style={styles.background}
    >
      {/* Overlay para mejorar el contraste */}
      <View style={styles.overlay} />

      <View style={styles.container}>
        <Image
          source={require("./../assets/logocaribe.png")}
          style={styles.logo}
        />

        <TextInput
          style={styles.input}
          placeholder="Correo Electrónico"
          value={email}
          onChangeText={setEmail}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Contraseña"
            secureTextEntry={!showPassword} // Alterna la visibilidad de la contraseña
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.showPasswordButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye" : "eye-off"} // Cambia entre "eye" y "eye-off"
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        {/* Texto interactivo de "¿Olvidaste tu contraseña?" */}
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPasswordScreen")}>
          <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botonLogin} onPress={handleLogin}>
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Iniciar sesión
          </Text>
        </TouchableOpacity>
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Oscurece la imagen de fondo para contraste
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
  },
  logo: {
    width: 265,
    height: 260,
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 20,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: "#fffFFFC2",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 20,
    marginTop: 20,
    backgroundColor: "#fffFFFC2",
  },
  inputPassword: {
    flex: 1,
    paddingHorizontal: 10,
    height: "100%",
  },
  showPasswordButton: {
    paddingHorizontal: 10,
  },
  forgotPasswordText: {
    color: "white", // Color distintivo para indicar interactividad
    fontSize: 16,
    marginTop: 10,
    textDecorationLine: "underline",
  },
  botonLogin: {
    width: "80%",
    height: 50,
    borderRadius: 20,
    backgroundColor: "#D4281C",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
});
