import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ImageBackground,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import Banner from './banner';
const { width: viewportWidth } = Dimensions.get("window");

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [artists, setArtists] = useState([]); // Estado para almacenar los artistas obtenidos
  const navigation = useNavigation();

  useEffect(() => {
    // Función para obtener los datos de artistas desde el servidor
    const fetchArtists = async () => {
      try {
        const response = await fetch(
          "http://10.1.80.148/CONEXION/getArtistas.php"
        );
        if (!response.ok) {
          throw new Error("Error al obtener los datos de artistas");
        }
        const data = await response.json();
        setArtists(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchArtists();
  }, []);

  const filteredArtists = artists.filter((artist) =>
    artist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <KeyboardAvoidingView
      style={styles.safeArea}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.select({ ios: 0, android: 80 })}
    >
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scrollView}>
        {/* Banner estático */}
        <Banner />

        {/* Título Datos Históricos */}
        <View style={styles.historicalDataContainer}>
          <Text style={styles.historicalDataTitle}>Descubre Aquí</Text>
        </View>

        {/* Contenedores grandes con iconos */}
        <View style={styles.bigImagesContainer}>
          
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.bigImageContainer}
              onPress={() => navigation.navigate("Artistas")}
            >
              <ImageBackground
                source={require("../assets/portada_final.png")}
                style={styles.backgroundImage}
              >
                <Text style={styles.bigImageTitle}>Artistas</Text>
                <View style={styles.iconContainer}>
                <Image style={styles.imagen} source={require("../assets/1a.png")} ></Image>
                </View>
              </ImageBackground>
                <Text style={styles.descriptionartistas}>
                Informacion de todos los Artistas
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bigImageContainer}
              onPress={() => navigation.navigate("Artistas")}
            >
              <ImageBackground
                source={require("../assets/portada_final.png")}
                style={styles.backgroundImage}
              >
                <Text style={styles.bigImageTitle}>Categorias</Text>
                <View style={styles.iconContainer}>
                <Image style={styles.imagen} source={require("../assets/4a.png")} ></Image>
                </View>
              </ImageBackground>
              <Text style={styles.descriptionejemplo}>
                Datos Curiosos de los Artistas
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.bigImageContainer}
              onPress={() => navigation.navigate("Canciones")}
            >
              <ImageBackground
                source={require("../assets/portada_final.png")}
                style={styles.backgroundImage}
              >
                <Text style={styles.bigImageTitle}>Canciones</Text>
                <View style={styles.iconContainer}>
                <Image style={styles.imagen} source={require("../assets/3a.png")} ></Image>
                </View>
              </ImageBackground>
              <Text style={styles.descriptioncaniones
              }>
              Canciones Populares de Artistas
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.bigImageContainer}  onPress={() => navigation.navigate("DatoCurioso")}>
              <ImageBackground
                source={require("../assets/portada_final.png")}
                style={styles.backgroundImage}
              >
                <Text style={styles.bigImageTitle}>Dato Curioso</Text>
                <View style={styles.iconContainer}>
                <Image style={styles.imagen} source={require("../assets/2a.png")} ></Image>
                </View>
              </ImageBackground>
              <Text style={styles.descriptiondatos}>
                Datos Curiosos de los Artistas
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "white",
    flex: 1,
  },
  imagen:{
    width: "100%",
    height: "100%",
  },
  scrollView: {
    flex: 1,
  },
  descriptiondatos: {
    backgroundColor: "#0D2A67",
    color: "white",
    padding: 9,
    fontSize: 16,
    fontFamily: "Montserrat",
    fontWeight: '700',
    textAlign: "center",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 10,
  },
  descriptionartistas: {
    backgroundColor: "#0D2A67",
    color: "white",
    padding: 10, 
    fontSize: 16,
    fontFamily: "Montserrat",
    fontWeight: '700',
    textAlign: "center",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 10,
  },
  descriptionejemplo: {
    backgroundColor: "#0D2A67",
    color: "white",
    padding: 9,
    fontSize: 16,
    fontFamily: "Montserrat",
    fontWeight: '700',
    textAlign: "center",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  descriptioncaniones: {
    backgroundColor: "#0D2A67",
    color: "white",
    padding: 10,
    fontSize: 16,
    fontFamily: "Montserrat",
    fontWeight: '700',
    textAlign: "center",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },

  historicalDataContainer: {
    alignItems: "center",
    marginTop: -10,
  },
  historicalDataTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  bigImagesContainer: {
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  bigImageContainer: {
    alignItems: "center",
    width: "45%", // Adjust width to ensure proper spacing
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backgroundImage: {
    width: "100%",
    height: 150,
    marginLeft: 12,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 10,
    overflow: "hidden",
  },
  iconContainer: {
    width: 96,
    height: 100,
    borderRadius: 5,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 35,
    marginRight: 50,
    marginLeft: 0,
  },
  bigImageTitle: {
    fontSize: 18,
    fontFamily: "Montserrat",
    fontWeight: '700',
    marginTop: 15,
    color: "#0D2A67",
    marginBottom: 9,
    marginRight: 10,
  },
});

export default HomeScreen;
