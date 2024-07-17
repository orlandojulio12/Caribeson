// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0); // Asegúrate de que setNotificationCount esté inicializada

  useEffect(() => {
    const loadAuthState = async () => {
      const storedAuthState = await AsyncStorage.getItem('isAuthenticated');
      if (storedAuthState) {
        setIsAuthenticated(JSON.parse(storedAuthState));
      }
    };

    loadAuthState();
  }, []);

  const login = async (token) => {
    await AsyncStorage.setItem('isAuthenticated', JSON.stringify(true));
    setIsAuthenticated(true);
    setUserToken(token);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    setUserToken(null);
    setNotificationCount(0); // Reinicia el contador de notificaciones al cerrar sesión
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, userToken, notificationCount, setNotificationCount }} // Asegúrate de incluir setNotificationCount en el valor del contexto
    >
      {children}
    </AuthContext.Provider>
  );
};
