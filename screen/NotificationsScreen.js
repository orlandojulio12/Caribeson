import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';

const NotificationsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedTime, setSelectedTime] = useState('7:00 P.M.');

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const times = [
    '09:00 A.M',
    '12:00 P.M',
    '4:00 P.M',
    '7:00 P.M',
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.description}>Elige si quieres recibir notificaciones y cuándo quieres recibirlas.</Text>

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Notificaciones</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={notificationsEnabled ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>

      <View style={styles.timesContainer}>
  {times.map((time) => (
    <TouchableOpacity
      key={time}
      style={[
        styles.timeButton,
        time === selectedTime && { backgroundColor: '#F25050' },
      ]}
      onPress={() => handleTimeSelect(time)}
    >
      <Text style={styles.timeText}>{time}</Text>
    </TouchableOpacity>
  ))}
</View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#212121',
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    color: '#212121',
    marginRight: 10,
  },
  timesContainer: {
    marginBottom: 20,
  },
  timeButton: {
    backgroundColor: '#212121',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  timeText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  problemText: {
    fontSize: 14,
    color: '#212121',
  },
  configurationText: {
    fontWeight: 'bold',
    color: 'red',
  },
});

export default NotificationsScreen;