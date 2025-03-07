import React, { useEffect } from 'react'; // Importation de React et de useEffect (non utilisé ici mais peut-être pour une future fonctionnalité)
import { Stack } from 'expo-router'; // Importation du composant Stack de 'expo-router' pour gérer la navigation par stack
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Importation du composant GestureHandlerRootView pour gérer les gestes tactiles

const AuthLayout = () => { // Définition du composant AuthLayout
  return (
    <>
      {/* Le GestureHandlerRootView enveloppe l'ensemble de l'application pour activer les gestes */}
      <GestureHandlerRootView className="flex-1" >
        {/* Stack permet de gérer la navigation par empilement des écrans */}
        <Stack 
          screenOptions={{
            swipeEnabled: true, // Permet l'activation du geste de balayage pour naviguer entre les écrans
            headerShown: false, // Masque l'en-tête par défaut pour l'écran
          }}
        >
          {/* Aucune route ou écran n'est spécifié ici */}
        </Stack>
      </GestureHandlerRootView>
    </>
  );
}

export default AuthLayout; // Exportation du composant AuthLayout pour utilisation ailleurs dans l'application
