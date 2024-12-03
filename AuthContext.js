// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userId, setUserId] = useState(null); // Estado para userId
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const storedAuthState = await AsyncStorage.getItem('isAuthenticated');
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedUserId = await AsyncStorage.getItem('userId');

        console.log('Estado almacenado:');
        console.log('isAuthenticated:', storedAuthState);
        console.log('userToken:', storedToken);
        console.log('userId:', storedUserId);

        if (storedAuthState && storedToken && storedUserId) {
          setIsAuthenticated(JSON.parse(storedAuthState));
          setUserToken(storedToken);
          setUserId(parseInt(storedUserId, 10));
          console.log('Datos cargados desde AsyncStorage:');
          console.log('isAuthenticated:', JSON.parse(storedAuthState));
          console.log('userToken:', storedToken);
          console.log('userId:', parseInt(storedUserId, 10));
        }
      } catch (error) {
        console.error('Error al cargar el estado de autenticación:', error);
      }
    };

    loadAuthState();
  }, []);

  const login = async (token, id) => { // Función para iniciar sesión
    try {
      await AsyncStorage.setItem('isAuthenticated', JSON.stringify(true));
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userId', id.toString());

      setIsAuthenticated(true);
      setUserToken(token);
      setUserId(id);

      console.log('Login exitoso. Datos almacenados:');
      console.log('Token:', token);
      console.log('UserId:', id);
    } catch (error) {
      console.error('Error al guardar el estado de autenticación:', error);
    }
  };

  const logout = async (navigation) => {
    try {
      await AsyncStorage.removeItem("isAuthenticated");
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userId");
      setIsAuthenticated(false);
      setUserToken(null);
      setUserId(null);
      setNotificationCount(0);

      if (navigation) {
        navigation.reset({
          index: 0,
          routes: [{ name: "PreLogin" }],
        });
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, userToken, userId, notificationCount, setNotificationCount }}
    >
      {children}
    </AuthContext.Provider>
  );
};
