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
  Modal,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import Banner from "./banner";

const { width: viewportWidth } = Dimensions.get("window");

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationToday, setNotificationToday] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const response = await fetch(
          "https://www.caribeson.com/CONEXION/getNotificacion.php"
        );
        const data = await response.json();

        if (Array.isArray(data)) {
          const today = new Date().toISOString().split("T")[0];
          const todayNotification = data.find((notification) =>
            notification.fecha.startsWith(today)
          );

          if (todayNotification) {
            setNotificationToday(todayNotification);
            setShowModal(true);
          }
        }
      } catch (error) {
        console.error("Error fetching notification:", error);
      }
    };

    fetchNotification();
  }, []);

  const truncatedDescription =
    notificationToday?.descripcion.length > 100
      ? `${notificationToday.descripcion.substring(0, 100)}...`
      : notificationToday?.descripcion;

  return (
    <KeyboardAvoidingView
      style={styles.safeArea}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.select({ ios: 0, android: 80 })}
    >
      <StatusBar barStyle="dark-content" />

      <ScrollView style={styles.scrollView}>
        <Banner />

        <View style={styles.historicalDataContainer}>
          <Text style={styles.historicalDataTitle}>Descubre Aquí</Text>
        </View>

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
                  <Image
                    style={styles.imagen}
                    source={require("../assets/1a.png")}
                  />
                </View>
              </ImageBackground>
              <Text style={styles.descriptionartistas}>
                Sumérgete en la trayectoria artística de los y las cultoras de
                la música del Caribe colombiano.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bigImageContainer}
              onPress={() => navigation.navigate("Categorias")}
            >
              <ImageBackground
                source={require("../assets/portada_final.png")}
                style={styles.backgroundImage}
              >
                <Text style={styles.bigImageTitle}>Género/Estilo</Text>
                <View style={styles.iconContainer}>
                  <Image
                    style={styles.imagen}
                    source={require("../assets/4a.png")}
                  />
                </View>
              </ImageBackground>
              <Text style={styles.descriptionejemplo}>
                Tu encuentro con las Cumbias, Gaitas, Porros, Música de cámara,
                Sinfónica, etc.
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
                  <Image
                    style={styles.imagen}
                    source={require("../assets/3a.png")}
                  />
                </View>
              </ImageBackground>
              <Text style={styles.descriptioncaniones}>
                Tu mejor opción para escuchar temas musicales de la costa norte.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bigImageContainer}
              onPress={() => navigation.navigate("DatoCurioso")}
            >
              <ImageBackground
                source={require("../assets/portada_final.png")}
                style={styles.backgroundImage}
              >
                <Text style={styles.bigImageTitle}>¿Sabias Que?</Text>
                <View style={styles.iconContainer}>
                  <Image
                    style={styles.imagen}
                    source={require("../assets/2a.png")}
                  />
                </View>
              </ImageBackground>
              <Text style={styles.descriptiondatos}>
                Conoce las anécdotas y curiosidades del mundo musical costeño.
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modal para mostrar la notificación del día */}

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {notificationToday && (
              <>
                <Text style={styles.modalTitle}>
                  {notificationToday.titulo}
                </Text>
                <Text style={styles.modalDescription}>
                  {truncatedDescription}
                </Text>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      setShowModal(false);
                      navigation.navigate("NotificacionDetalle", {
                        item: notificationToday,
                      });
                    }}
                  >
                    <Text style={styles.buttonText}>Ver más</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button2}
                    onPress={() => setShowModal(false)}
                  >
                    <Text style={styles.buttonText}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "white",
    flex: 1,
  },
  imagen: {
    width: "100%",
    height: "100%",
  },
  scrollView: {
    flex: 1,
  },
  descriptiondatos: {
    backgroundColor: "#0D2A67",
    color: "white",
    padding: "10%",
    fontSize: 14,
    fontFamily: "Montserrat",
    fontWeight: "700",
    textAlign: "center",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 10,
  },
  descriptionartistas: {
    backgroundColor: "#0D2A67",
    color: "white",
    padding: "8%",
    fontSize: 16,
    fontFamily: "Montserrat",
    fontWeight: "700",
    textAlign: "center",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 10,
  },
  descriptionejemplo: {
    backgroundColor: "#0D2A67",
    color: "white",
    padding: "8%",
    fontSize: 16,
    fontFamily: "Montserrat",
    fontWeight: "700",
    textAlign: "center",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  descriptioncaniones: {
    backgroundColor: "#0D2A67",
    color: "white",
    padding: "8%",
    fontSize: 16,
    fontFamily: "Montserrat",
    fontWeight: "700",
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
    fontWeight: "700",
    marginTop: 15,
    color: "#0D2A67",
    marginBottom: 9,
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "#0D2A67",
    borderRadius: 5,
    alignItems: "center",
  },
  button2: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "red",
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;
