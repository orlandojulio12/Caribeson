import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Banner from "./banner";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width: viewportWidth } = Dimensions.get("window");

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dataCuriosa, setDataCuriosa] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://caribeson.com/CONEXION/getDatoCurioso.php"
        );
        const result = await response.json();
        setDataCuriosa(result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View>
        <Banner />
      </View>
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons
          name="magnify"
          size={25}
          color="gray"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchBar}
          placeholder="Buscar Dato Curioso"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>
      {dataCuriosa.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.card,
            index % 2 === 0 ? styles.cardLeft : styles.cardRight,
          ]}
          onPress={() => navigation.navigate("DetailScreen", { item })}
        >
          {index % 2 === 0 && (
            <Image source={{ uri: item.foto }} style={styles.image} />
          )}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.titulo }</Text>
            <Text style={styles.description}>
              {item.dato_curioso.length > 100
                ? `${item.dato_curioso.substring(0, 100)}...`
                : item.dato_curioso}
            </Text>

            {item.dato_curioso.length > 100 && (
              <Text style={styles.viewMore}>Ver más</Text>
            )}
            <Text style={styles.date}>{item.fecha}</Text>
          </View>
          {index % 2 !== 0 && (
            <Image source={{ uri: item.foto }} style={styles.image} />
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "gray",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    height: 18,
    paddingHorizontal: 10,
  },
  card: {
    flexDirection: "row",
    borderRadius: 10,
    margin: 10,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "white", // Color de fondo eliminado
  },
  cardLeft: {
    justifyContent: "flex-start",
  },
  cardRight: {
    justifyContent: "flex-end",
  },
  image: {
    width: 120,
    height: 170,
    borderRadius: 10,
    marginRight: 10, // Espacio entre la imagen y el texto
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 10, // Espacio entre la imagen y el texto
  },
  title: {
    color: "#0D2A67",
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 18,
  },
  description: {
    color: "#000",
    marginBottom: 5,
  },
  viewMore: {
    color: "#0D2A67",
    marginTop: 5,
    fontWeight: "bold",
  },
  date: {
    color: "#000",
  },
});

export default HomeScreen;
