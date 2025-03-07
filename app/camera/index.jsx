import { CameraView , useCameraPermissions } from 'expo-camera'; // Importation des composants pour gérer la caméra avec Expo
import { useState, useRef } from 'react'; // Importation des hooks React pour gérer l'état et les références
import { useRouter } from "expo-router"; // Importation du hook pour gérer la navigation dans Expo
import { color } from '../../assets/color'; // Importation des couleurs définies dans le projet
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // Importation des composants de React Native pour l'UI
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importation pour gérer le stockage local des données

export default function App() {
  // Définition de l'état pour la direction de la caméra et pour la permission d'utilisation de la caméra
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  
  const router = useRouter(); // Initialisation du hook de navigation
  const cameraRef = useRef(null); // Référence à la caméra pour pouvoir interagir avec elle directement

  // Si la permission de la caméra n'est pas encore déterminée, on ne rend rien
  if (!permission) {
    return <View />; // Rendu vide en attendant la permission
  }

  // Si la permission n'est pas accordée, afficher un message demandant la permission
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Donnez votre permission pour l'utilisation de la caméra</Text> 
        {/* Message pour l'utilisateur pour demander la permission */}
        <Button onPress={requestPermission} title="grant permission" /> {/* Bouton pour demander la permission */}
      </View>
    );
  }

  // Fonction pour basculer entre la caméra arrière et la caméra avant
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back')); // Change la caméra de "back" à "front" et vice versa
  }

  // Fonction pour prendre une photo
  const takeAPhoto = async () => {
    if (cameraRef.current) { // Vérifie si la référence de la caméra est valide
      const photoData = await cameraRef.current.takePictureAsync(); // Prendre la photo avec la caméra
      console.log(photoData.uri); // Afficher l'URI de l'image dans la console

      // Sauvegarder l'URI de la photo dans le stockage local (AsyncStorage)
      await AsyncStorage.setItem('photo', photoData.uri);

      // Rediriger l'utilisateur vers la page de profil après la prise de la photo
      router.push('../[user]/profil');
    }
  };

  return (
    <View className="flex-1"> {/* Conteneur principal qui occupe toute la hauteur de l'écran */}
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}> 
        {/* Affichage de la vue caméra avec la direction spécifiée (avant ou arrière) */}
        <View className="flex-1 justify-end items-center"> {/* Positionnement des éléments en bas de l'écran */}
          <View className="flex-row justify-end items-center mb-32"> {/* Alignement horizontal des boutons */}
            {/* Bouton pour basculer entre les caméras avant et arrière */}
            <TouchableOpacity
              style={{ backgroundColor: color.orange }} // Style personnalisé avec une couleur orange pour le bouton
              className="w-32 h-32 bg-black rounded-full items-center justify-center mx-10" // Styles utilitaires pour la taille, le fond et l'alignement
              onPress={toggleCameraFacing} // Appel de la fonction pour basculer la caméra
            >
              <Text className="text-white">Flip</Text> {/* Texte du bouton pour indiquer l'action de bascule */}
            </TouchableOpacity>

            {/* Bouton pour prendre une photo */}
            <TouchableOpacity
              style={{ backgroundColor: color.orange }} // Couleur orange du bouton
              className="w-32 h-32 bg-black rounded-full items-center justify-center mx-10" // Styles utilitaires pour la taille et l'alignement
              onPress={takeAPhoto} // Appel de la fonction pour prendre une photo
            >
              <Text className="text-white">Prendre une photo</Text> {/* Texte du bouton pour indiquer l'action de prise de photo */}
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

// Définition des styles utilisés dans le composant
const styles = StyleSheet.create({
  message: {
    textAlign: 'center', // Centrer le texte horizontalement
    paddingBottom: 10, // Ajouter un espacement en bas du texte
  },
  camera: {
    flex: 1, // La caméra occupe tout l'espace disponible dans le conteneur
  },
  buttonContainer: {
    flex: 1, 
    flexDirection: 'row', // Disposition des boutons en ligne horizontale
    backgroundColor: 'transparent', // Le fond est transparent
    margin: 64, // Espacement autour du conteneur de boutons
  }
});
