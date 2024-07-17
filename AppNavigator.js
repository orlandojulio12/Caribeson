import React, { useContext } from "react";
import { Image, TouchableOpacity, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import LoginScreen from "./screen/LoginScreen";
import RegisterScreen from "./screen/RegisterScreen";
import HomeScreen from "./screen/HomeScreen";
import ArtistBiographyScreen from "./screen/ArtistBiographyScreen";
import VideoFromYouTube from "./screen/VideoFromYoutube";
import SettingsScreen from "./screen/SettingsScreen";
import PreLoginScreen from "./screen/PreLoginScreen";
import { AuthContext } from "./AuthContext"; // Asegúrate de importar AuthContext correctamente
import NotificationsScreen from "./screen/NotificationsScreen";
import CancionesScreen from "./screen/CancionesScreen";
import ArtistsScreen from "./screen/ArtistasScreen";
import SplashScreen from "./screen/SplashScreen";
import DatosHistoricosScreen from "./screen/DatosHistoricosScreen";
import GetNotificaciones from "./screen/getNotificacionScreen"; // Asegúrate de importar GetNotificaciones correctamente
import DetailScreen from "./screen/DetailScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  const { isAuthenticated, notificationCount, setNotificationCount } = useContext(AuthContext); // Obtén setNotificationCount del contexto
  const navigation = useNavigation();

  return (
    <Tab.Navigator
      initialRouteName={isAuthenticated ? "Caribeson" : "PreLogin"}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Caribeson':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Canciones':
              iconName = focused ? 'music-box-multiple' : 'music-box-multiple-outline';
              break;
            case 'Artistas':
              iconName = focused ? 'account-music' : 'account-music-outline';
              break;
            case 'DatoCurioso':
              iconName = focused ? 'book-search' : 'book-search-outline';
              break;
            case 'Configuracion':
              iconName = focused ? 'cog' : 'cog-outline';
              break;
            default:
              iconName = focused ? 'home' : 'home-outline';
              break;
          }

          // Return the appropriate icon component
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0D2A67', // Color para el ícono seleccionado
        tabBarInactiveTintColor: '#808080', // Color para los íconos no seleccionados
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        },
      })}
    >
      {isAuthenticated ? (
        <>
          <Tab.Screen
            name="Caribeson"
            component={HomeScreen}
            options={{
              tabBarShowLabel: false,
              headerTitle: () => (
                <Image
                  source={require("./assets/caribesologotipo.png")}
                  style={{ width: 110, height: 90 }}
                  resizeMode="contain"
                />
              ),
              headerStyle: {
                backgroundColor: "white",
              },
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Notification");
                    setNotificationCount(0); // Reset notification count on navigating to notifications
                  }}
                >
                  <MaterialCommunityIcons
                    name="bell-outline"
                    size={25}
                    color="black"
                    style={{ marginRight: 15 }}
                  />
                  {notificationCount > 0 && (
                    <Text
                      style={{
                        position: "absolute",
                        top: -5,
                        right: 6,
                        backgroundColor: "#D4281C",
                        color: "white",
                        borderRadius: 10,
                        width: 15,
                        height: 16,
                        textAlign: "center",
                        fontSize: 12,
                      }}
                    >
                      {notificationCount}
                    </Text>
                  )}
                </TouchableOpacity>
              ),
            }}
          />
          <Tab.Screen
            name="Canciones"
            component={CancionesScreen}
            options={{
              tabBarShowLabel: false,
              headerTitle: "Canciones",
              headerTitleStyle: {
                fontFamily: "OleoScript",
                fontSize: 24,
                color: "#D4281C",
              },
              headerStyle: {
                backgroundColor: "white",
              },
            }}
          />
          <Tab.Screen
            name="Artistas"
            component={ArtistsScreen}
            options={{
              tabBarShowLabel: false,
              headerTitle: "Artistas",
              headerTitleStyle: {
                fontFamily: "OleoScript",
                fontSize: 24,
                color: "#D4281C",
              },
              headerStyle: {
                backgroundColor: "white",
              },
            }}
          />
          <Tab.Screen
            name="DatoCurioso"
            component={DatosHistoricosScreen}
            options={{
              tabBarShowLabel: false,
              headerTitle: "Dato Curioso",
              headerTitleStyle: {
                fontFamily: "OleoScript",
                fontSize: 24,
                color: "#D4281C",
              },
              headerStyle: {
                backgroundColor: "white",
              },
            }}
          />
          <Tab.Screen
            name="Configuracion"
            component={SettingsScreen}
            options={{
              tabBarShowLabel: false,
              headerTitle: "Ajustes",
              headerTitleStyle: {
                fontFamily: "OleoScript",
                fontSize: 24,
                color: "#D4281C",
              },
              headerStyle: {
                backgroundColor: "white",
              },
            }}
          />
        </>
      ) : (
        <>
          <Tab.Screen
            name="PreLogin"
            component={PreLoginScreen}
            options={{ headerShown: false, tabBarStyle: { display: "none" } }}
          />
          <Tab.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false, tabBarStyle: { display: "none" } }}
          />
          <Tab.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false, tabBarStyle: { display: "none" } }}
          />
        </>
      )}
    </Tab.Navigator>
  );
}

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{ headerShown: true }}
      >
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Biografia"
          component={ArtistBiographyScreen}
          options={{
            headerTitle: "Biografía",
            headerTitleStyle: {
              fontFamily: "OleoScript",
              fontSize: 24,
              color: "#D4281C",
            },
            headerStyle: {
              backgroundColor: "white",
            },
          }}
        />
        <Stack.Screen
          name="Notificaciones"
          component={NotificationsScreen}
          options={{
            headerTitle: "Notificaciones",
            headerTitleStyle: {
              fontFamily: "OleoScript",
              fontSize: 24,
              color: "#D4281C",
            },
            headerStyle: {
              backgroundColor: "white",
            },
          }}
        />
        <Stack.Screen
          name="VideoFromYouTube"
          component={VideoFromYouTube}
          options={{
            headerTitle: "Reproductor de Videos",
            headerTitleStyle: {
              fontFamily: "OleoScript",
              fontSize: 24,
              color: "#D4281C",
            },
            headerStyle: {
              backgroundColor: "white",
            },
          }}
        />
        <Stack.Screen
          name="DetailScreen"
          component={DetailScreen}
          options={{
            headerTitle: "Dato Curioso",
            headerTitleStyle: {
              fontFamily: "OleoScript",
              fontSize: 24,
              color: "#D4281C",
            },
            headerStyle: {
              backgroundColor: "white",
            },
          }}
        />
        <Stack.Screen
          name="Notification"
          component={GetNotificaciones} // Asegúrate de usar GetNotificaciones en lugar de getNotificaciones
          options={{
            headerTitle: "Notificaciones",
            headerTitleStyle: {
              fontFamily: "OleoScript",
              fontSize: 24,
              color: "#D4281C",
            },
            headerStyle: {
              backgroundColor: "white",
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
