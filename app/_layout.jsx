import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomHeader from '../components/CustomHeader';
import { ThemeProvider } from '../contexts/ThemeContext';
import { registerForPushNotificationsAsync } from '../utils/notifications'; // Importer la fonction des notifications
import { getUser } from '../lib/axios';
import NotificationPermission from '../components/NotificationPermission';
import AppListeners from '../utils/AppListeners';

const RootLayout = () => {
  useEffect(() => {
    async function setupNotifications() {
      const user = await getUser();  // Récupérer l'utilisateur actuel
      console.log(user);
      if (user) {
        await registerForPushNotificationsAsync(user.id); // Enregistre l'utilisateur pour les notifications
      } else {
        console.log("Utilisateur non connecté, pas d'enregistrement pour les notifications.");
      }
    }
    setupNotifications();
  }, []);

  return (
    <ThemeProvider>
      <AppListeners />
      <NotificationPermission />
      <Layout />
    </ThemeProvider>
  );
};

const Layout = () => {
  return (
    <GestureHandlerRootView className="flex-1">
      <Drawer 
        screenOptions={{
          swipeEnabled: false,
          header: ({ navigation }) => <CustomHeader navigation={navigation} tabName={""} />,
        }}
      >
        <Drawer.Screen name="index" options={{ headerShown: false, title: "Page d'acceuil", drawerItemStyle: { display: '' } }} />
        <Drawer.Screen name="auth" options={{ title: "Signin", headerShown: false, drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="[user]/profil" options={{ title: "Profil" }} />
        <Drawer.Screen name="[user]/setting" options={{ title: "Settings" }} />
        <Drawer.Screen name="[user]/addPet" options={{ title: "Ajouter un animal" }} />
        <Drawer.Screen name="[user]/animalProfil" options={{ title: "Profil de vos animaux" }} />
        <Drawer.Screen name="[user]/myAnimal" options={{ title: "Vos animaux" }} />
        <Drawer.Screen name="camera/index" options={{ headerShown: false, drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="camera1/index" options={{ headerShown: false, drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="[user]/statsScreen" options={{ title: "Graphique" }} />
        <Drawer.Screen name="[user]/Feed" options={{ title: "Feed!" }} />
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
