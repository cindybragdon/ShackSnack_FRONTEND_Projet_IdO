import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Modal, Button, StyleSheet, Switch } from 'react-native';
import { useTheme } from "../../contexts/ThemeContext";
import { color } from "../../assets/color";
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

const Setting = () => {
  const { theme, toggleTheme } = useTheme();
  const colors = color[theme];

  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [darkModeEnabled, setDarkModeEnabled] = useState(theme === 'dark');

  const toggleReminder = () => {
    setReminderEnabled(!reminderEnabled);
    if (!reminderEnabled) {
      setModalVisible(true);
    }
  };

  const handleToggleTheme = () => {
    setDarkModeEnabled(!darkModeEnabled);
    toggleTheme();
  };

  const handlePing = async () => {
    try {
      const response = await axios.get('http://192.168.1.100:5000/ping', { timeout: 2000 });
      if (response.status === 200) {
        Alert.alert("📡 État du distributeur", "✅ Distributeur en ligne !");
      } else {
        Alert.alert("📡 État du distributeur", "❌ Réponse inattendue du serveur");
      }
    } catch (error) {
      Alert.alert("📡 État du distributeur", "❌ Impossible d'établir un signal");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background_w }]}>
      <Text style={[styles.title, { color: colors.orange }]}>⚙️ Paramètres</Text>

      <View style={styles.settingsContainer}>
        {/* Mode Sombre */}
        <View style={[styles.settingRow, { borderBottomColor: colors.black }]}>
          <Text style={[styles.settingText, { color: colors.black }]}>🌙 Mode sombre</Text>
          <Switch value={darkModeEnabled} onValueChange={handleToggleTheme} />
        </View>

        {/* Rappel */}
        <View style={[styles.settingRow, { borderBottomColor: colors.black }]}>
          <Text style={[styles.settingText, { color: colors.black }]}>⏰ Ajouter un rappel</Text>
          <Switch value={reminderEnabled} onValueChange={toggleReminder} />
        </View>
      </View>

      {/* Choix de l'heure pour le rappel */}
      {modalVisible && (
        <Modal transparent animationType="slide" visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { backgroundColor: colors.background_w }]}>
              <Text style={{ color: colors.black, fontSize: 18, marginBottom: 10 }}>📅 Choisir une date :</Text>
              <DateTimePicker
                value={selectedDate}
                mode="datetime"
                display="default"
                onChange={(event, date) => date && setSelectedDate(date)}
              />
              <Button title="✔️ Valider" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      )}

      {/* Ping du distributeur */}
      <TouchableOpacity onPress={handlePing} style={[styles.pingButton, { backgroundColor: colors.blue }]}>
        <Text style={[styles.pingText, { color: colors.background }]}>📍 Tester la connexion</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 25,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 30,
  },
  settingsContainer: {
    width: "90%",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingText: {
    fontSize: 18,
    fontWeight: "500",
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  pingButton: {
    marginTop: 30,
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  pingText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Setting;
