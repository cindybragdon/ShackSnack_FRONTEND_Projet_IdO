import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function AppListeners() {
  const router = useRouter();

  useEffect(() => {
    const notificationReceivedSubscription = Notifications.addNotificationReceivedListener(notification => {
      const screen = notification.request.content.data?.screen; // Par exemple "camera"

      Alert.alert(
        "Notification reçue",
        notification.request.content.body || "Vous avez une notification",
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Se déplacer vers la caméra",
            onPress: () => {
              if (screen) {
                console.log("Navigation vers:", screen);
                router.push(`/${screen}`); // Redirige vers la bonne page
              } else {
                console.log("Aucune route définie dans la notification.");
              }
            }
          }
        ]
      );
    });

    const notificationResponseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      const screen = response.notification.request.content.data?.screen;
      if (screen) {
        console.log("Navigation via notification cliquée:", screen);
        router.push(`/${screen}`);
      }
    });

    return () => {
      notificationReceivedSubscription.remove();
      notificationResponseSubscription.remove();
    };
  }, []);

  return null;
}
