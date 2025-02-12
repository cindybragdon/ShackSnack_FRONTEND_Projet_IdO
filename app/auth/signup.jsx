import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import { color } from '../../assets/color';
import React, { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { useTheme } from "../../contexts/ThemeContext"
import { signUp } from '../../lib/axios';
import Icon from 'react-native-vector-icons/FontAwesome5';


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

  const { theme } = useTheme()
  const colors = color[theme]

  const router = useRouter();

  const submit = async () => {

    if(form.username == "" || form.password == "" || form.email == "" || form.firstname == "" || form.lastname == "" ) {
      if(form.username == ""){
          setAlertUsername(true)
      }
      else{
        setAlertUsername(false)
      }
      if(form.password == ""){
        setAlertMDP(true)
      }
      else{
        setAlertMDP(false)
      }
      if(form.email == ""){
        setAlertEmail(true)
      }
      else{
        setAlertEmail(false)
      }
      return null
    } 

    console.log(`Trying to SignUp with username : ${form.username}, email : ${form.email} and password : ${form.password}`)

    try{
        setLoading(true)
        const result = await signUp(form.firstname, form.lastname,form.username, form.email, form.password)
        
        setLoading(false)
        setForm({username:"", email:"", password:"", firstname:"", lastname:""})
        router.push(`../${result.id}/profil`)

    } catch(error){
        setLoading(false)
        console.log(error)
        if(error.message.includes("Request failed with status code 409")){
          
          setMsgErreur("Email et/ou Identifiant déjà utilisé")
        }
        else{
          setMsgErreur("Désolé : Il y a un problème de notre côté, veuillez réessayer plus tard.")
        }
        console.log("Error : ",error)
    }}


  return (
    <KeyboardAvoidingView
      className="flex-1"
      style={{ backgroundColor: colors.background_w }}
      keyboardVerticalOffset={0}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView>
        <View className="flex-1 items-center" style={{ backgroundColor: colors.background_w }}>
          <View>
            <Text className="text-5xl tracking-[4px] pt-24 pb-2 mb-[-20]" style={{ color: colors.black }}>Votre animal</Text>
            <Text className="text-5xl tracking-[4px] mb-[-10]" style={{ color: colors.black }}>mérite</Text>
            <Text className="text-5xl font-bold" style={{ color: colors.black }}>le meilleur ...</Text>
            <Text className="text-xl font-semibold pb-2 mb-[70]" style={{ color: colors.orange }}>Inscrivez-vous maintenant. C'est gratuit! 🐶🐱</Text>

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

            <View className="border-2 rounded-lg mb-8" style={{ color: colors.darkgreen }}>
              <View className="absolute z-10 -top-2.5 left-4 w-auto px-1" style={{ backgroundColor: colors.background_w, color: colors.darkgreen }}>
                <Text className="w-auto" style={{ color: colors.orange }}>Nom</Text>
              </View>
              <TextInput
                className="justify-center py-4 rounded-lg text-center"
                style={{ width: WIDTH_BTN, color: colors.orange, backgroundColor: colors.background_w }}
                placeholder="Entrez votre nom"
                placeholderTextColor={colors.orange}
                value={form.lastname}
                onChangeText={(text) => setForm({ ...form, lastname: text })}
              />
            </View>

            <View className="border-2 rounded-lg mb-8" style={{ color: colors.darkgreen }}>
              <View className="absolute z-10 -top-2.5 left-4 w-auto px-1" style={{ backgroundColor: colors.background_w, color: colors.darkgreen }}>
                <Text className="w-auto" style={{ color: colors.orange }}>Pseudo</Text>
              </View>
              <TextInput
                className="justify-center py-4 rounded-lg text-center"
                style={{ width: WIDTH_BTN, color: colors.orange, backgroundColor: colors.background_w }}
                placeholder="Entrez votre pseudo"
                placeholderTextColor={colors.orange}
                value={form.username}
                onChangeText={(text) => setForm({ ...form, username: text })}
              />
              {alertUsername ? <Icon className="absolute right-4 p-3" name="exclamation-triangle" size={20} color={colors.orange} />: null}

            </View>

            <View className="border-2 rounded-lg mb-8" style={{ color: color.orange }}>
              <View className="absolute z-10 -top-2.5 left-4 w-auto px-1" style={{ backgroundColor: colors.background_w, color: colors.orange }}>
                <Text className="w-auto" style={{ color: colors.orange }}>Courriel</Text>
              </View>
              <TextInput
                className="justify-center py-4 rounded-lg text-center"
                style={{ width: WIDTH_BTN, color: colors.orange, backgroundColor: colors.background_w }}
                placeholder="Entrez votre courriel"
                placeholderTextColor={colors.orange}
                value={form.email}
                onChangeText={(text) => setForm({ ...form, email: text })}
              />
              { alertEmail ? <Icon className="absolute right-4 p-3" name="exclamation-triangle" size={20} color={colors.orange} />: null}

            </View>

            <View className="border-2 rounded-lg mb-8" style={{ color: colors.orange }}>
              <View className="absolute z-10 -top-2.5 left-4 w-auto px-1" style={{ backgroundColor: colors.background_w, color: colors.orange}}>
                <Text className="w-auto" style={{ color: colors.orange }}>Mot de passe</Text>
              </View>
              <TextInput
                className="justify-center py-4 rounded-lg text-center"
                style={{ width: WIDTH_BTN, color: colors.orange, backgroundColor: colors.background_w }}
                placeholder="Entrez votre mot de passe"
                placeholderTextColor={colors.orange}
                secureTextEntry
                value={form.password}
                onChangeText={(text) => setForm({ ...form, password: text })}
              />
              {alertMDP ? <Icon className="absolute right-4 p-3" name="exclamation-triangle" size={20} color={colors.orange} />: null}

            </View>

            <TouchableOpacity 
              className="py-4 rounded-xl px-7 mt-[40] mb-6" 
              style={{ width: WIDTH_BTN, backgroundColor: colors.blue }}
              onPress={() => submit()}
            >
              <Text className="text-center font-medium text-2xl" style={{ color: colors.background }}>
                Créez le compte
              </Text>
            </TouchableOpacity>

            <View className="items-center">
                <Text class="text-3xl font-bold underline " style={{color:colors.orange}}>Si vous avez déja un compte, <Link style={{color:colors.black}} className="underline" href="./signin">connectez-vous</Link></Text>
                </View>

          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Signup;
