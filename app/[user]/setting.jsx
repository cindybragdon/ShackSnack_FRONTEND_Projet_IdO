import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Modal, Button, StyleSheet, Switch } from 'react-native';
import { useTheme } from "../../contexts/ThemeContext"; // Importation du contexte de thème
import { color } from "../../assets/color"; // Importation des couleurs du projet
import DateTimePicker from '@react-native-community/datetimepicker'; // Importation du sélecteur de date et heure
import axios from 'axios'; // Importation de la bibliothèque axios pour faire des requêtes HTTP

const Setting = () => {
  const { theme, toggleTheme } = useTheme(); // Récupère le thème actuel et la fonction pour le changer
  const colors = color[theme]; // Sélection des couleurs en fonction du thème choisi

  const [reminderEnabled, setReminderEnabled] = useState(false); // État pour savoir si le rappel est activé ou non
  const [modalVisible, setModalVisible] = useState(false); // État pour savoir si le modal est visible ou non
  const [selectedDate, setSelectedDate] = useState(new Date()); // État pour stocker la date sélectionnée
  const [darkModeEnabled, setDarkModeEnabled] = useState(theme === 'dark'); // État pour savoir si le mode sombre est activé ou non

  // Fonction pour activer ou désactiver le rappel
  const toggleReminder = () => {
    setReminderEnabled(!reminderEnabled); // Inverse l'état du rappel
    if (!reminderEnabled) { // Si le rappel n'était pas activé, on affiche le modal pour choisir la date
      setModalVisible(true);
    }
  };

  // Fonction pour basculer entre le mode sombre et clair
  const handleToggleTheme = () => {
    setDarkModeEnabled(!darkModeEnabled); // Inverse l'état du mode sombre
    toggleTheme(); // Change le thème global
  };

  // Fonction pour tester la connexion au distributeur
  const handlePing = async () => {
    try {
      const response = await axios.get('http://192.168.1.100:5000/ping', { timeout: 2000 }); // Envoie une requête GET pour vérifier la connexion
      if (response.status === 200) { // Si la réponse est OK, afficher un message de succès
        Alert.alert("📡 État du distributeur", "✅ Distributeur en ligne !");
      } else { // Si la réponse est inattendue
        Alert.alert("📡 État du distributeur", "❌ Réponse inattendue du serveur");
      }
    } catch (error) { // En cas d'erreur, afficher un message d'erreur
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
          <Switch value={darkModeEnabled} onValueChange={handleToggleTheme} /> {/* Switch pour basculer le mode sombre */}
        </View>

        {/* Rappel */}
        <View style={[styles.settingRow, { borderBottomColor: colors.black }]}>
          <Text style={[styles.settingText, { color: colors.black }]}>⏰ Ajouter un rappel</Text>
          <Switch value={reminderEnabled} onValueChange={toggleReminder} /> {/* Switch pour activer/désactiver le rappel */}
        </View>
      </View>

      {/* Choix de l'heure pour le rappel */}
      {modalVisible && ( // Si le modal est visible, afficher le sélecteur de date et heure
        <Modal transparent animationType="slide" visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { backgroundColor: colors.background_w }]}>
              <Text style={{ color: colors.black, fontSize: 18, marginBottom: 10 }}>📅 Choisir une date :</Text>
              <DateTimePicker
                value={selectedDate}
                mode="datetime"
                display="default"
                onChange={(event, date) => date && setSelectedDate(date)} // Mise à jour de la date sélectionnée
              />
              <Button title="✔️ Valider" onPress={() => setModalVisible(false)} /> {/* Bouton pour valider la date */}
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
