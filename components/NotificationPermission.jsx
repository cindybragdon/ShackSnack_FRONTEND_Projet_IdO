import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import * as Notifications from 'expo-notifications';

const NotificationPermission = () => {
  const [permissionStatus, setPermissionStatus] = useState(null);

  useEffect(() => {
    async function checkPermission() {
      const { status } = await Notifications.getPermissionsAsync();
      setPermissionStatus(status);
    }
    
    checkPermission();
  }, []);

  // Si la permission a déjà été donnée, on ne montre plus le bouton
  if (permissionStatus === 'granted') {
    return null;  // Ne rien afficher si la permission est accordée
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Nous avons besoin de votre permission pour vous envoyer des notifications.</Text>
      <Button 
        title="Activer les notifications"
        onPress={async () => {
          const { status } = await Notifications.requestPermissionsAsync();
          setPermissionStatus(status);  // Met à jour le statut après la demande
          if (status === 'granted') {
            console.log('Notification autorisée');
          } else {
            console.log('Notification refusée');
          }
        }}
      />
    </View>
  );
};

export default NotificationPermission;
