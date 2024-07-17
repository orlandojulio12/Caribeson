// App.js
import React, { useState, useEffect, useContext } from 'react';
import { Platform } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import AppNavigator from './AppNavigator';
import * as Notifications from 'expo-notifications';
import * as FileSystem from 'expo-file-system';
import { AuthProvider, AuthContext } from './AuthContext';

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

const AppContent = () => {
  const { setNotificationCount } = useContext(AuthContext);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        await fetchFonts();
        const permissionGranted = await requestNotificationPermissions();
        if (permissionGranted) {
          await setupNotifications();
        }
      } catch (error) {
        console.error('Error en la configuración inicial:', error);
      } finally {
        setAppIsReady(true);
        SplashScreen.hideAsync();
      }
    };

    prepareApp();
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
        const response = await fetch('http://10.1.80.148/CONEXION/send_notifications.php');
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
