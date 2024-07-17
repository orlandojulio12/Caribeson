import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  Dimensions,Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function PreLoginScreen() {
  const navigation = useNavigation();
  const { width: viewportWidth } = Dimensions.get("window");
  const openLink = (url) => {
    Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  };
  return (
    <ImageBackground
      source={require("./../assets/fondo.png")}
      style={styles.background}
    >
    
        <View style={styles.logoContainer}>
          <Image
            source={require("./../assets/logocaribe.png")}
            style={styles.logo}
          />
        </View>
        <View style={styles.sloganContainer}>
          <Text style={styles.slogan}>
            Conoce la historia detras de cada nota.
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.buttonText}>Inicio</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.buttonText}>Registrate</Text>
          </TouchableOpacity>
        </View>
      
      <View style={styles.logoContainerTp}>
        <TouchableOpacity onPress={() => openLink('https://redtecnoparque.com/barranquilla/')}>
          <Image
            source={require("./../assets/tp-blanco.png")}
            style={[
              styles.logoTp,
              {
                width: viewportWidth * 0.4,
                height: (viewportWidth * 0.4 * 941) / 3825,
              },
            ]}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.logoContainerUniAtlantico}>
        <TouchableOpacity onPress={() => openLink('https://www.uniatlantico.edu.co/')}>
          <Image
            source={require("./../assets/UniAtlanticoBlanco.png")}
            style={[
              styles.logoUniAtlantico,
              {
                width: viewportWidth * 0.3,
                height: (viewportWidth * 0.3 * 127) / 330,
              },
            ]}
          />
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
  logoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end", // Mueve el logo hacia la parte inferior de su contenedor
    paddingBottom: 5, // Ajusta el espacio debajo del logo
  },
  // overlay: {
  //   ...StyleSheet.absoluteFillObject,
  //   backgroundColor: "rgba(13, 42, 103, 0.6)",
  // },
  logo: {
    width: 280,
    height: 210,
  },
  logoTp: {
    // El tamaño será ajustado dinámicamente
  },
  logoContainerTp: {
    position: "absolute",
    bottom: 20,
    left: 20,
  },
  logoUniAtlantico: {
    // El tamaño será ajustado dinámicamente
  },
  logoContainerUniAtlantico: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  sloganContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  slogan: {
    fontSize: 44,
    color: "white",
    fontFamily: "OleoScript", // Asegúrate de que la fuente esté cargada en tu proyecto
    textAlign: "center",
    marginHorizontal: 20,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    alignSelf: "center",
    marginTop: 20, // Ajusta el espacio encima de los botones
  },
  button: {
    width: "40%",
    height: 50,
    backgroundColor: "#D4281C",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
