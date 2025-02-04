import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import { color } from '../../assets/color';
import React, { useState } from 'react';
import { Link, useRouter } from 'expo-router';

const WIDTH_BTN = Dimensions.get('window').width - 56;

const Signup = () => {
  const [alertUsername, setAlertUsername] = useState(false);
  const [alertEmail, setAlertEmail] = useState(false);
  const [alertMDP, setAlertMDP] = useState(false);
  const [msgErreur, setMsgErreur] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
  });

  const router = useRouter();

  const submit = async () => {
    if (!form.username || !form.password || !form.email) {
      setAlertUsername(!form.username);
      setAlertMDP(!form.password);
      setAlertEmail(!form.email);
      return;
    }

    try {
      setLoading(true);
      const result = await signUp(form.username, form.email, form.password);
      setLoading(false);
      setForm({ firstname: "", lastname: "", username: "", email: "", password: "" });
      router.push(`../${result.id}/profile`);
    } catch (error) {
      setLoading(false);
      setMsgErreur(
        error.message.includes("Request failed with status code 409")
          ? "Email et/ou Identifiant déjà utilisé"
          : "Désolé : Il y a un problème de notre côté, veuillez réessayer plus tard."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      style={{ backgroundColor: color.background }}
      keyboardVerticalOffset={0}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView>
        <View className="flex-1 items-center" style={{ backgroundColor: color.background }}>
          <View>
            <Text className="text-5xl tracking-[4px] pt-24 pb-2 mb-[-20]" style={{ color: color.black }}>Votre animal</Text>
            <Text className="text-5xl tracking-[4px] mb-[-10]" style={{ color: color.black }}>mérite</Text>
            <Text className="text-5xl font-bold" style={{ color: color.black }}>le meilleur ...</Text>
            <Text className="text-xl font-semibold pb-2 mb-[70]" style={{ color: color.orange }}>Inscrivez-vous maintenant. C'est gratuit! 🐶🐱</Text>

            <View className="border-2 rounded-lg mb-8" style={{ color: color.darkgreen }}>
              <View className="absolute z-10 -top-2.5 left-4 w-auto px-1" style={{ backgroundColor: color.background, color: color.darkgreen }}>
                <Text className="w-auto" style={{ color: color.orange }}>Prénom</Text>
              </View>
              <TextInput
                className="justify-center py-4 rounded-lg text-center"
                style={{ width: WIDTH_BTN, color: color.orange, backgroundColor: color.background }}
                placeholder="Entrez votre prénom"
                placeholderTextColor={color.orange}
                value={form.firstname}
                onChangeText={(text) => setForm({ ...form, firstname: text })}
              />
            </View>

            <View className="border-2 rounded-lg mb-8" style={{ color: color.darkgreen }}>
              <View className="absolute z-10 -top-2.5 left-4 w-auto px-1" style={{ backgroundColor: color.background, color: color.darkgreen }}>
                <Text className="w-auto" style={{ color: color.orange }}>Nom</Text>
              </View>
              <TextInput
                className="justify-center py-4 rounded-lg text-center"
                style={{ width: WIDTH_BTN, color: color.orange, backgroundColor: color.background }}
                placeholder="Entrez votre nom"
                placeholderTextColor={color.orange}
                value={form.lastname}
                onChangeText={(text) => setForm({ ...form, lastname: text })}
              />
            </View>

            <View className="border-2 rounded-lg mb-8" style={{ color: color.darkgreen }}>
              <View className="absolute z-10 -top-2.5 left-4 w-auto px-1" style={{ backgroundColor: color.background, color: color.darkgreen }}>
                <Text className="w-auto" style={{ color: color.orange }}>Pseudo</Text>
              </View>
              <TextInput
                className="justify-center py-4 rounded-lg text-center"
                style={{ width: WIDTH_BTN, color: color.orange, backgroundColor: color.background }}
                placeholder="Entrez votre pseudo"
                placeholderTextColor={color.orange}
                value={form.username}
                onChangeText={(text) => setForm({ ...form, username: text })}
              />
            </View>

            <View className="border-2 rounded-lg mb-8" style={{ color: color.orange }}>
              <View className="absolute z-10 -top-2.5 left-4 w-auto px-1" style={{ backgroundColor: color.background, color: color.orange }}>
                <Text className="w-auto" style={{ color: color.orange }}>Courriel</Text>
              </View>
              <TextInput
                className="justify-center py-4 rounded-lg text-center"
                style={{ width: WIDTH_BTN, color: color.orange, backgroundColor: color.background }}
                placeholder="Entrez votre courriel"
                placeholderTextColor={color.orange}
                value={form.email}
                onChangeText={(text) => setForm({ ...form, email: text })}
              />
            </View>

            <View className="border-2 rounded-lg mb-8" style={{ color: color.orange }}>
              <View className="absolute z-10 -top-2.5 left-4 w-auto px-1" style={{ backgroundColor: color.background, color: color.orange}}>
                <Text className="w-auto" style={{ color: color.orange }}>Mot de passe</Text>
              </View>
              <TextInput
                className="justify-center py-4 rounded-lg text-center"
                style={{ width: WIDTH_BTN, color: color.orange, backgroundColor: color.background }}
                placeholder="Entrez votre mot de passe"
                placeholderTextColor={color.orange}
                secureTextEntry
                value={form.password}
                onChangeText={(text) => setForm({ ...form, password: text })}
              />
            </View>

            <TouchableOpacity 
              className="py-4 rounded-xl px-7 mt-[40] mb-6" 
              style={{ width: WIDTH_BTN, backgroundColor: color.blue }}
              onPress={submit}
            >
              <Text className="text-center font-medium text-2xl" style={{ color: color.background }}>
                Créez le compte
              </Text>
            </TouchableOpacity>

            <View className="items-center">
                <Text class="text-3xl font-bold underline " style={{color:color.orange}}>Si vous avez déja un compte, <Link style={{color:color.black}} className="underline" href="./signin">connectez-vous</Link></Text>
                </View>

          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Signup;
