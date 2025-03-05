import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Modal, Button, StyleSheet, Switch } from 'react-native';
import { useTheme } from "../../contexts/ThemeContext";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { color } from "../../assets/color";
import DateTimePicker from '@react-native-community/datetimepicker';

const Setting = () => {
  const { theme, toggleTheme } = useTheme();
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const toggleNotif = () => setNotifEnabled(!notifEnabled);
  const toggleReminder = () => {
    setReminderEnabled(!reminderEnabled);
    if (!reminderEnabled) {
      setModalVisible(true);
    }
  };

  const handlePing = () => {
    // Simulation du ping (remplace par une vraie requête vers le distributeur)
    const isOnline = Math.random() > 0.5;
    Alert.alert("État du distributeur", isOnline ? "📡 Distributeur en marche" : "❌ Impossible d'établir un signal");
  };

  return (
    <View className="flex-1 items-center">
      <Text className="uppercase text-2xl">Paramètres</Text>

      {/* Dark Mode */}
      <TouchableOpacity onPress={toggleTheme}>
        <Text>
          <Icon name={theme === 'light' ? "moon" : "sun"} size={30} color={color.orange} />
        </Text>
      </TouchableOpacity>

      {/* Notifications Slider */}
      <View style={styles.settingRow}>
        <Text>Autoriser les notifications</Text>
        <Switch value={notifEnabled} onValueChange={toggleNotif} />
      </View>

      {/* Reminder Slider */}
      <View style={styles.settingRow}>
        <Text>Ajouter un rappel</Text>
        <Switch value={reminderEnabled} onValueChange={toggleReminder} />
      </View>

      {/* Modal pour choisir le jour et l'heure */}
      {modalVisible && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>Choisir un jour et une heure :</Text>
              <DateTimePicker
                value={selectedDate}
                mode="datetime"
                display="default"
                onChange={(event, date) => {
                  if (date) setSelectedDate(date);
                }}
              />
              <Button title="Valider" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      )}

      {/* Ping du distributeur */}
      <TouchableOpacity style={styles.pingButton} onPress={handlePing}>
        <Text>📍 Ping Distributeur</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: "80%",
    marginVertical: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  pingButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: color.orange,
    borderRadius: 10,
  }
});

export default Setting;
