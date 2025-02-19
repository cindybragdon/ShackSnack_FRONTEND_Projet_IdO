import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { getUser } from "../lib/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const registerForPushNotificationsAsync = async (userId) => {
    let token;

    // Vérifie la plateforme et configure la notification sur Android
    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
        });
    }

    // Vérifie d'abord si l'utilisateur a déjà accepté les notifications
    const { status } = await Notifications.getPermissionsAsync();

    if (status === "granted") {
        console.log("Permission déjà accordée pour les notifications.");
    } else if (status === "denied") {
        alert("Vous avez précédemment refusé les notifications. Vous pouvez les activer dans les paramètres.");
        return;
    } else {
        // Demander la permission si elle n'a pas encore été accordée
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== "granted") {
            alert("Permission refusée pour les notifications !");
            return;
        }
        console.log("Permission accordée pour les notifications.");
    }

    try {
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log("Expo Push Token:", token);
    } catch (error) {
        console.error("Erreur lors de la récupération du token:", error);
    }
    

    // Récupère l'utilisateur connecté
    const raspberryPiIP = await AsyncStorage.getItem('raspberryIp') || "192.168.2.223";
    if (!raspberryPiIP) {
        console.error("RaspberryPi IP non trouvé !");
        return;
    } else {
        console.log("raspberryPiIP trouvée : ", raspberryPiIP);
    }

    // Envoie l'ID utilisateur et le token au Raspberry Pi via l'API
    console.log("Tentative d'envoi des informations au Raspberry Pi...");
    await fetch(`http://${raspberryPiIP}:5000/register_user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user_id: userId,
            expo_token: token,
        }),
    })
    .then(response => response.json())
    .then(data => console.log("Réponse du serveur :", data))
    .catch(error => console.error("Erreur lors de l'envoi :", error));
    
};
