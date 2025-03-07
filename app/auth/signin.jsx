import { View, Image, StyleSheet, Text, KeyboardAvoidingView, Platform, ScrollView, Dimensions, TextInput, TouchableOpacity } from 'react-native'; // Importation des composants nécessaires de React Native
import React, { useState, useEffect } from 'react'; // Importation des hooks de React
import * as Font from 'expo-font'; // Importation de la bibliothèque pour charger des polices personnalisées
import { useRouter, Link } from 'expo-router'; // Importation des outils de navigation d'Expo Router
import { color } from '../../assets/color'; // Importation de la palette de couleurs personnalisée
import { SafeAreaView } from 'react-native-safe-area-context'; // Importation de SafeAreaView pour la gestion des zones sûres
import { useTheme } from "../../contexts/ThemeContext"; // Importation du contexte de thème
import { signIn } from '../../lib/axios.js'; // Importation de la fonction de connexion via Axios
import Icon from 'react-native-vector-icons/FontAwesome5'; // Importation des icônes FontAwesome5

const signin = () => {

  const router = useRouter(); // Récupération de l'objet de navigation
  const WIDTH_BTN = Dimensions.get('window').width - 56; // Calcul de la largeur du bouton pour s'ajuster à la taille de l'écran
  const [fontLoaded, setFontLoaded] = useState(false); // État pour gérer le chargement de la police
  const [alertIdentifier, setAlertIdentifier] = useState(false); // État pour gérer l'alerte liée à l'identifiant
  const [alertMDP, setAlertMDP] = useState(false); // État pour gérer l'alerte liée au mot de passe
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" }); // État pour le formulaire de connexion
  const { theme } = useTheme(); // Récupération du thème actuel depuis le contexte
  const colors = color[theme]; // Sélection des couleurs en fonction du thème

  const [loading, setLoading] = useState(false); // État pour gérer le chargement
  const [msgErreur, setMsgErreur] = useState(""); // État pour afficher les messages d'erreur

  useEffect(() => { // Hook pour charger la police personnalisée au démarrage
    async function loadFont() {
      await Font.loadAsync({
        'cookie': require('../../assets/font/Cookie-Regular.ttf'), // Chargement de la police 'Cookie'
      });
      setFontLoaded(true); // Mise à jour de l'état lorsque la police est chargée
    }

    loadFont();
  }, []); // Ce hook se déclenche uniquement au montage du composant

  // Fonction qui gère la soumission du formulaire
  const submit = async () => {

    // Vérification si les champs sont remplis
    if (form.usernameOrEmail == "" || form.password == "") {
      // Si le champ identifiant est vide
      if (form.usernameOrEmail == "") {
        setAlertIdentifier(true);
        // Si le champ mot de passe est vide
        if (form.password == "") {
          setAlertMDP(true);
        } else {
          setAlertMDP(false);
        }
      } else {
        setAlertIdentifier(false);
        setAlertMDP(true);
      }
      return null; // Sortie de la fonction si les champs sont vides
    }

    console.log(`Tentative de connexion avec le nom d'utilisateur ou le courriel : ${form.usernameOrEmail} et le mot de passe : ${form.password}`);

    try {
      setLoading(true); // Affichage du chargement
      const result = await signIn(form.usernameOrEmail, form.password); // Appel à la fonction de connexion
      console.log(result);
      setLoading(false); // Fin du chargement
      setForm({ usernameOrEmail: "", password: "" }); // Réinitialisation du formulaire
      router.push(`../${result.id}/profil`); // Redirection vers le profil de l'utilisateur

    } catch (error) {
      setLoading(false); // Fin du chargement
      // Gestion des erreurs
      if (error.message == "AxiosError: Requête échouée avec le code d'état 401") {
        setMsgErreur("Identifiant ou mot de passe incorrect");
      } else {
        setMsgErreur("Désolé : Il y a un problème de notre côté, veuillez réessayer plus tard.");
      }
      console.log("Error : ", error.message); // Affichage de l'erreur
    }

  };

  return (

    <KeyboardAvoidingView
      keyboardVerticalOffset={0} // Décalage vertical pour éviter que le clavier masque les champs
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Gestion de l'affichage du clavier selon la plateforme
      className="flex-1 justify-evenly items-center"
      style={[{ backgroundColor: colors.background_w }]} // Application de la couleur de fond selon le thème
    >
      <ScrollView> 
        <View className={`flex-1 items-center`} style={{ backgroundColor: colors.background_w }}>
          {/* Image de logo ou d'illustration */}
          <Image
            className="mb-[-100] mt-12"
            source={require('../../assets/images/homedogcat.png')}
            style={styles.image}
          />

          {/* Texte du titre de l'application */}
          <Text className="text-7xl font-bold tracking-[2px] text-center uppercase pt-24 pb-2 mb-[-40]" style={{ color: colors.black }}>the </Text>
          <Text className={`text-7xl text-center tracking-[4px] mb-[-25]`} style={{ fontFamily: 'cookie', color: colors.blue }}>
            snack
          </Text>
          <Text className="text-7xl font-bold tracking-[2px] text-center uppercase  pb-2 mb-[-20]" style={{ color: colors.black }}>shack </Text>
          <Text className="text-2xl uppercase font-semibold pb-2 text-center mb-[90]" style={{ color: colors.orange }}>Connectez-vous</Text>

          <View className="items-center">
            {/* Champ de saisie pour l'identifiant */}
            <View className="border-2 rounded-lg mb-8">
              <View className="absolute z-10 -top-2.5 left-4 w-auto px-1" style={{ backgroundColor: colors.background_w }}>
                <Text className="w-auto" style={{ color: colors.orange }}>Courriel</Text>
              </View>
              <TextInput
                className="justify-center py-4 rounded-lg text-center"
                style={{ width: WIDTH_BTN, color: colors.orange, backgroundColor: colors.background_w }}
                placeholder="Entrez votre courriel"
                placeholderTextColor={colors.blue}
                value={form.usernameOrEmail}
                onChangeText={(text) => setForm({ ...form, usernameOrEmail: text })} // Mise à jour de l'état pour le champ identifiant
              />
              {/* Affichage d'une icône d'alerte si le champ est vide */}
              {alertIdentifier ? <Icon className="absolute right-4 p-3" name="exclamation-triangle" size={20} color={colors.orange} /> : null}
            </View>

            {/* Champ de saisie pour le mot de passe */}
            <View className="border-2 rounded-lg mb-8">
              <View className="absolute z-10 -top-2.5 left-4 w-auto px-1" style={{ backgroundColor: colors.background_w }}>
                <Text className="w-auto" style={{ color: colors.orange }}>Mot de passe</Text>
              </View>
              <TextInput
                className="justify-center py-4 rounded-lg text-center"
                style={[{ width: WIDTH_BTN, color: colors.orange, backgroundColor: colors.background_w }]}
                placeholder="Entrez votre mot de passe"
                placeholderTextColor={colors.blue}
                value={form.password}
                secureTextEntry
                onChangeText={(text) => setForm({ ...form, password: text })} // Mise à jour de l'état pour le champ mot de passe
              />
              {/* Affichage d'une icône d'alerte si le champ est vide */}
              {alertMDP ? <Icon className="absolute right-4 p-3" name="exclamation-triangle" size={20} color={colors.orange} /> : null}
            </View>

            {/* Bouton de soumission */}
            <TouchableOpacity className="py-4 rounded-xl px-7 mb-6" style={[{ width: WIDTH_BTN, backgroundColor: colors.blue }]} onPress={() => submit()}>
              <Text className="text-center font-medium text-2xl" style={[{ color: colors.background }]}>Se connecter</Text>
            </TouchableOpacity>
          </View>

          {/* Lien vers la page d'inscription */}
          <Text className="text-3xl font-bold underline" style={{ color: colors.orange }}>Si vous n'avez pas de compte, <Link style={{ color: colors.black }} className="underline" href="./signup">cliquez-ici</Link></Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 200,
    width: 200,
    resizeMode: 'contain', // Redimensionnement de l'image sans déformation
  },
});

export default signin; // Exportation du composant signin
