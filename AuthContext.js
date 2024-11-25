// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userId, setUserId] = useState(null); // Añade estado para userId
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const loadAuthState = async () => {
      const storedAuthState = await AsyncStorage.getItem('isAuthenticated');
      if (storedAuthState) {
        setIsAuthenticated(JSON.parse(storedAuthState));
      }
    };

    loadAuthState();
  }, []);

  const login = async (token, id) => { // Modifica login para recibir el userId
    await AsyncStorage.setItem('isAuthenticated', JSON.stringify(true));
    setIsAuthenticated(true);
    setUserToken(token);
    setUserId(id); // Guarda el userId al iniciar sesión
  };

  const logout = async (navigation) => {
    await AsyncStorage.removeItem("isAuthenticated");
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
  };
  

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, userToken, userId, notificationCount, setNotificationCount }}
    >
      {children}
    </AuthContext.Provider>
  );
};
