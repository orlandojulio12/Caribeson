import React, { useState, useEffect, useContext } from 'react';
import { Platform } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import AppNavigator from './AppNavigator';
import * as Notifications from 'expo-notifications';
import * as FileSystem from 'expo-file-system';
import { AuthProvider, AuthContext } from './AuthContext';
import Constants from 'expo-constants';

const PROJECT_ID = "aff50a16-e4ee-474e-a970-7827ec769d13"; // Tu projectId de Expo

SplashScreen.preventAutoHideAsync();

const fetchFonts = () => {
  return Font.loadAsync({
    'OleoScript': require('./assets/fonts/OleoScript-Regular.ttf'),
    'Montserrat': require('./assets/fonts/Montserrat-VariableFont_wght.ttf'),
    'Sandler': require('./assets/fonts/Sandler-Trial.otf'),
  });
};

async function requestNotificationPermissions() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('No se pudo obtener el permiso para notificaciones');
    return false;
  }
  return true;
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }

  // Usar el projectId directamente si no está disponible en Constants.manifest
  const token = (await Notifications.getExpoPushTokenAsync({
    projectId: PROJECT_ID,
  })).data;
  console.log('Push Token:', token);

  // Enviar el token al backend para almacenarlo
  try {
    const response = await fetch('https://caribeson.com/CONEXION/store_token.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
      }),
    });
    const responseData = await response.json();
    console.log('Response from server:', responseData);
  } catch (error) {
    console.error('Error sending token to server:', error);
  }

  return token;
}

const AppContent = () => {
  const { setNotificationCount } = useContext(AuthContext);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        await fetchFonts();
        const permissionGranted = await requestNotificationPermissions();
        if (permissionGranted) {
          console.log('Permissions granted');
          await registerForPushNotificationsAsync(); // Registra para notificaciones push
          await setupNotifications();
        } else {
          console.log('Permissions not granted');
        }
      } catch (error) {
        console.error('Error en la configuración inicial:', error);
      } finally {
        setAppIsReady(true);
        SplashScreen.hideAsync();
      }
    };

    prepareApp();

    const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response received:', response);
    });

    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    return () => {
      backgroundSubscription.remove();
      foregroundSubscription.remove();
    };
  }, []);

  const setupNotifications = async () => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    const checkNotifications = async () => {
      try {
        const response = await fetch('https://caribeson.com/CONEXION/send_notifications.php');
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          setNotificationCount(data.length);
          for (const notification of data) {
            let notificationContent = {
              title: notification.titulo,
              body: notification.descripcion,
            };

            if (notification.foto) {
              if (Platform.OS === 'ios') {
                notificationContent.attachments = [
                  {
                    url: notification.foto,
                    identifier: 'image',
                  },
                ];
              } else if (Platform.OS === 'android') {
                const fileName = `notification_image_${Date.now()}.jpg`;
                const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
                try {
                  await FileSystem.downloadAsync(notification.foto, fileUri);
                  notificationContent.attachments = [fileUri];
                } catch (error) {
                  console.error('Error al descargar la imagen:', error);
                  notificationContent.body += `\n\nNo se pudo cargar la imagen: ${notification.foto}`;
                }
              }
            }

            await Notifications.scheduleNotificationAsync({
              content: notificationContent,
              trigger: null,
            });
          }
        }
      } catch (error) {
        console.error('Error al obtener notificaciones:', error);
      }
    };

    setInterval(checkNotifications, 15 * 60 * 1000);
    await checkNotifications();
  };

  if (!appIsReady) {
    return null;
  }

  return <AppNavigator />;
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
