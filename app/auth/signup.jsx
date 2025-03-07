import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import { color } from '../../assets/color';
import React, { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { useTheme } from "../../contexts/ThemeContext";
import { signUp } from '../../lib/axios';
import Icon from 'react-native-vector-icons/FontAwesome5';

// Définir la largeur du bouton en fonction de la taille de l'écran
const WIDTH_BTN = Dimensions.get('window').width - 56;

const Signup = () => {
  // États pour gérer les alertes d'erreur, les messages et le statut de chargement
  const [alertUsername, setAlertUsername] = useState(false);
  const [alertEmail, setAlertEmail] = useState(false);
  const [alertMDP, setAlertMDP] = useState(false);
  const [msgErreur, setMsgErreur] = useState("");
  const [loading, setLoading] = useState(false);

  // Formulaire d'inscription initialisé avec des valeurs vides
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
  });

  // Récupération du thème via le contexte
  const { theme } = useTheme();
  const colors = color[theme]; // Applique les couleurs du thème

  const router = useRouter(); // Utilisation du hook pour la navigation

  // Fonction de soumission du formulaire
  const submit = async () => {
    // Vérification si tous les champs sont remplis
    if(form.username == "" || form.password == "" || form.email == "" || form.firstname == "" || form.lastname == "") {
      // Affichage des alertes pour les champs manquants
      if(form.username == "") setAlertUsername(true);
      else setAlertUsername(false);
      if(form.password == "") setAlertMDP(true);
      else setAlertMDP(false);
      if(form.email == "") setAlertEmail(true);
      else setAlertEmail(false);
      return null; // Ne pas soumettre si un champ est vide
    } 

    console.log(`Trying to SignUp with username : ${form.username}, email : ${form.email} and password : ${form.password}`);

    try {
      setLoading(true); // Affichage du chargement
      const result = await signUp(form.firstname, form.lastname, form.username, form.email, form.password); // Appel de la fonction signUp
      setLoading(false); // Masquer le chargement après la réponse
      setForm({ username: "", email: "", password: "", firstname: "", lastname: "" }); // Réinitialiser le formulaire
      router.push(`../${result.id}/profil`); // Rediriger l'utilisateur vers son profil après l'inscription réussie
    } catch(error) {
      setLoading(false); // Masquer le chargement en cas d'erreur
      console.log(error);
      if(error.message.includes("Request failed with status code 409")) {
        setMsgErreur("Email et/ou Identifiant déjà utilisé"); // Message d'erreur si le compte existe déjà
      } else {
        setMsgErreur("Désolé : Il y a un problème de notre côté, veuillez réessayer plus tard.");
      }
      console.log("Error : ", error);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      style={{ backgroundColor: colors.background_w }} // Appliquer la couleur de fond du thème
      keyboardVerticalOffset={0}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adapter le comportement du clavier pour iOS et Android
    >
      <ScrollView>
        <View className="flex-1 items-center" style={{ backgroundColor: colors.background_w }}>
          {/* En-tête du formulaire */}
          <View>
            <Text className="text-5xl tracking-[4px] pt-24 pb-2 mb-[-20]" style={{ color: colors.black }}>Votre animal</Text>
            <Text className="text-5xl tracking-[4px] mb-[-10]" style={{ color: colors.black }}>mérite</Text>
            <Text className="text-5xl font-bold" style={{ color: colors.black }}>le meilleur ...</Text>
            <Text className="text-xl font-semibold pb-2 mb-[70]" style={{ color: colors.orange }}>Inscrivez-vous maintenant. C'est gratuit! 🐶🐱</Text>

            {/* Champs du formulaire */}
            {/* Prénom */}
            <View className="border-2 rounded-lg mb-8" style={{ color: colors.darkgreen }}>
              <View className="absolute z-10 -top-2.5 left-4 w-auto px-1" style={{ backgroundColor: colors.background_w, color: colors.darkgreen }}>
                <Text className="w-auto" style={{ color: colors.orange }}>Prénom</Text>
              </View>
              <TextInput
                className="justify-center py-4 rounded-lg text-center"
                style={{ width: WIDTH_BTN, color: colors.orange, backgroundColor: colors.background_w }}
                placeholder="Entrez votre prénom"
                placeholderTextColor={colors.orange}
                value={form.firstname}
                onChangeText={(text) => setForm({ ...form, firstname: text })}
              />
            </View>

            {/* Autres champs (Nom, Pseudo, Email, Mot de passe) similaires à Prénom */}
            {/* ... */}

            {/* Bouton de soumission */}
            <TouchableOpacity 
              className="py-4 rounded-xl px-7 mt-[40] mb-6" 
              style={{ width: WIDTH_BTN, backgroundColor: colors.blue }}
              onPress={() => submit()}
            >
              <Text className="text-center font-medium text-2xl" style={{ color: colors.background }}>
                Créer le compte
              </Text>
            </TouchableOpacity>

            {/* Lien vers la page de connexion */}
            <View className="items-center">
              <Text class="text-3xl font-bold underline " style={{ color: colors.orange }}>
                Si vous avez déja un compte, <Link style={{ color: colors.black }} className="underline" href="./signin">connectez-vous</Link>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Signup;
