import { View,Image, StyleSheet,  Text, KeyboardAvoidingView, Platform, ScrollView, Dimensions, TextInput, TouchableOpacity} from 'react-native'
import React, { useState, useEffect } from 'react'
import * as Font from 'expo-font';
import { useRouter, Link } from 'expo-router'
import { color } from '../../assets/color'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from "../../contexts/ThemeContext"
import { signIn } from '../../lib/axios.js';
import Icon from 'react-native-vector-icons/FontAwesome5';


const signin = () => {

const router = useRouter()
const  WIDTH_BTN = Dimensions.get('window').width - 56
const [fontLoaded, setFontLoaded] = useState(false);
const [alertIdentifier, setAlertIdentifier] = useState(false)
const [alertMDP, setAlertMDP] = useState(false)
const [form, setForm] = useState({usernameOrEmail:"",password:""})
const { theme } = useTheme()
const colors = color[theme]

const [loading, setLoading] = useState(false);
const [msgErreur, setMsgErreur] = useState("");

useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        'cookie': require('../../assets/font/Cookie-Regular.ttf'),
      });
      setFontLoaded(true);
    }

    loadFont();
  }, []);

  const submit = async () => {

    if(form.usernameOrEmail == "" || form.password == ""){
      if(form.usernameOrEmail == ""){
          setAlertIdentifier(true)
          if(form.password == ""){
            setAlertMDP(true)
          }
          else{
            setAlertMDP(false)
          }
      }
      else{
        setAlertIdentifier(false)
        setAlertMDP(true)
      }
      return null
    }
  
    console.log(`Trying to signIn with usernameOrEmail : ${form.usernameOrEmail} and password : ${form.password}`)
  
    try{
        setLoading(true)
        const result = await signIn(form.usernameOrEmail,form.password);
        console.log(result);
        setLoading(false)
        setForm({usernameOrEmail:"",password:""})
        router.push(`../${result.id}/profil`)
  
    } catch(error){
        setLoading(false)
        if(error.message == "AxiosError: Request failed with status code 401"){
          setMsgErreur("Identifiant ou mot de passe incorrect")
        }
        else{
          setMsgErreur("Désolé : Il y a un problème de notre côté, veuillez réessayer plus tard.")
        }
        console.log("Error : ",error.message)
    }
  
  } 

  

  return (

    <KeyboardAvoidingView 
            keyboardVerticalOffset={0}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 justify-evenly items-center"
            style={[{backgroundColor:colors.background_w}]}
          >
    <ScrollView>
    <View className={`flex-1 items-center`} style={{backgroundColor: colors.background_w}}>
    <Image
                className="mb-[-100] mt-12"
                source={require('../../assets/images/homedogcat.png')}
                style={styles.image}
            />
        
        <View>
        
        <Text className="text-7xl font-bold tracking-[2px] text-center uppercase pt-24 pb-2 mb-[-40]" style={{color:colors.black}}>the </Text>
        <Text className={`text-7xl text-center tracking-[4px] mb-[-25]`} style={{ fontFamily: 'cookie',color:colors.blue }}>
                snack
        </Text>  
        <Text className="text-7xl font-bold tracking-[2px] text-center uppercase  pb-2 mb-[-20]" style={{color:colors.black}}>shack </Text>
        <Text className="text-2xl uppercase font-semibold pb-2 text-center mb-[90]" style={{color:colors.orange}}>Connectez-vous</Text>

        <View className=" items-center">
        <View className="border-2 rounded-lg mb-8">
              <View className="absolute z-10 -top-2.5 left-4 w-auto px-1" style={{ backgroundColor: colors.background_w, color: colors.blue }}>
                <Text className="w-auto" style={{ color: colors.orange}}>Courriel</Text>
              </View>
              <TextInput
                className="justify-center py-4 rounded-lg text-center"
                style={{ width: WIDTH_BTN, color: colors.orange, backgroundColor: colors.background_w }}
                placeholder="Entrez votre courriel"
                placeholderTextColor={colors.blue}
                value={form.usernameOrEmail}
                onChangeText={(text) => setForm({ ...form, usernameOrEmail: text })}
              />
              {alertIdentifier ? <Icon className="absolute right-4 p-3" name="exclamation-triangle" size={20} color={colors.orange} />: null}
            </View>


            </View>

                  <View className="border-2 rounded-lg mb-8" style={{color: colors.background }}>
                <View className="absolute z-10 -top-2.5 left-4 w-auto px-1" style={{backgroundColor:colors.background_w, color: color.orange}}><Text className="w-auto" style={{color: colors.orange }}> Mot de passe  </Text>
                </View>

                        <TextInput
                        className="justify-center py-4 rounded-lg text-center "
                        style={[{width: WIDTH_BTN,  color: colors.orange, backgroundColor: colors.background_w}]}
                        placeholder='Entrez votre mot de passe '
                        placeholderTextColor={colors.blue}
                        value={form.password}
                        onChangeText={(text) => setForm({ ...form, password: text })}
                        />
                      {alertMDP ? <Icon className="absolute right-4 p-3" name="exclamation-triangle" size={20} color={colors.orange} />: null}

                  </View>
                  
                <View className="pt-4">
                  <TouchableOpacity className="py-4 rounded-xl px-7 mb-6" style={[{width:WIDTH_BTN,backgroundColor:colors.blue}]} onPress={() => submit()}>
                      <Text className="text-center font-medium text-2xl" style={[{color:colors.background}]}>Se connecter</Text>
                  </TouchableOpacity>
                </View>

        </View>
        <Text class="text-3xl font-bold underline" style={{color:colors.orange}}>Si vous n'avez pas de compte, <Link style={{color:colors.black}} className="underline" href="./signup">Cliquez-ici</Link></Text>
        <Text class="text-3xl font-bold underline" style={{color:colors.orange}}>Si vous n'avez pas de compte, <Link style={{color:colors.black}} className="underline" href="../[user]/profil">profil</Link></Text>
    </View>
    </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  image: {
      height: 200,
      width: 200,
      resizeMode: 'contain',
  },
});

export default signin