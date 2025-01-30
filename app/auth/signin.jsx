import { View,Image, StyleSheet,  Text, KeyboardAvoidingView, Platform, ScrollView, Dimensions, TextInput, TouchableOpacity} from 'react-native'
import React, { useState, useEffect } from 'react'
import * as Font from 'expo-font';
import { useRouter, Link } from 'expo-router'
import { color } from '../../assets/color'
import { SafeAreaView } from 'react-native-safe-area-context'


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
      const result = await signIn(form.usernameOrEmail,form.password)
      setLoading(false)
      setForm({usernameOrEmail:"",password:""})
      router.push(`../${result.id}/profile`)

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


const signin = () => {

const router = useRouter()
const  WIDTH_BTN = Dimensions.get('window').width - 56
const [fontLoaded, setFontLoaded] = useState(false);
const [alertIdentifier, setAlertIdentifier] = useState(false)
const [alertMDP, setAlertMDP] = useState(false)
const [form, setForm] = useState({usernameOrEmail:"",password:""})

useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        'cookie': require('../../assets/font/Cookie-Regular.ttf'),
      });
      setFontLoaded(true);
    }

    loadFont();
  }, []);

  

  return (

    <KeyboardAvoidingView 
            keyboardVerticalOffset={0}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 justify-evenly items-center"
            style={[{backgroundColor:color.background}]}
          >
    <SafeAreaView>
    <View className={`flex-1 items-center`} style={{backgroundColor: color.background}}>
    <Image
                className="mb-[-100] mt-12"
                source={require('../../assets/images/homedogcat.png')}
                style={styles.image}
            />
        
        <View>
        
        <Text className="text-7xl font-bold tracking-[2px] text-center uppercase pt-24 pb-2 mb-[-40]" style={{color:color.black}}>the </Text>
        <Text className={`text-7xl text-center tracking-[4px] mb-[-25]`} style={{ fontFamily: 'cookie',color:color.mediumgreen }}>
                snack
        </Text>  
        <Text className="text-7xl font-bold tracking-[2px] text-center uppercase  pb-2 mb-[-20]" style={{color:color.black}}>shack </Text>
        <Text className="text-2xl uppercase font-semibold pb-2 text-center mb-[100]" style={{color:color.lightgreen}}>Connectez-vous</Text>

        <View>
                  <View className="flex-row items-center">
                    <TextInput
                      className="justify-center py-5 rounded-lg text-center" 
                      style={[{backgroundColor:color.lightgreen, color:color.black, width:WIDTH_BTN},alertIdentifier ? {paddingRight:56,borderWidth:2,borderColor:colors.alert} : {}]}
                      onChangeText={(item) => {setForm({...form,usernameOrEmail : item})}}
                      placeholder="Entrez l'email"
                      placeholderTextColor={color.darkgreen}
                      value={form.usernameOrEmail}
                      />
                    {alertIdentifier ? <Icon className="absolute right-4" name="exclamation-triangle" size={30} color={colors.alert} />: null}
                  </View>
                  
                  <View className="justify-end items-center mb-8"  style={{width:WIDTH_BTN}} >
                      <Link href="./recovery">
                          <Text style={{color:color.darkgreen}}>Email oublié?</Text>
                      </Link>
                  </View>
                  {alertIdentifier ? <Text className="pt-1" style={{color:color.pink}}>Email : Ce champs doit être rempli</Text> : null}
                </View>

                <View>
                  <View className="flex-row items-center" >
                    <TextInput
                        className="justify-center py-5 rounded-lg text-center" 
                        style={[{width:WIDTH_BTN,backgroundColor:color.lightgreen, color:color.black},alertMDP ? {paddingRight:56,borderWidth:2,borderColor:colors.alert} : {}]}
                        onChangeText={(item) => {setForm({...form,password : item})}}
                        placeholder='Entrez le mot de passe'
                        placeholderTextColor={color.darkgreen}
                        value={form.password}
                      />
                    {alertMDP ? <Icon name="exclamation-triangle" size={30} color={colors.alert} style={{ position: 'absolute',right: 15, }}/>: null}
                  </View>
                  <View className="justify-start items-center mb-[50]"  style={{width:WIDTH_BTN}} >
                    <Link href="./recovery">
                        <Text style={{color:color.darkgreen}}>Mot de passe oublié?</Text>
                    </Link>
                  </View>
                  {alertMDP? <Text className="pt-1" style={{color:colors.alert}}>Mot de passe : Ce champs doit être rempli</Text> : null}
                
                </View>
                <View className="pt-4">
                  <TouchableOpacity className="py-4 rounded-xl px-7" style={[{width:WIDTH_BTN,backgroundColor:color.darkgreen}]} onPress={submit}>
                      <Text className="text-center font-medium text-2xl" style={[{color:color.background}]}>Se connecter</Text>
                  </TouchableOpacity>
                </View>

        </View>
        <Text class="text-3xl font-bold underline" style={{color:color.darkgreen}}>Si vous n'avez pas de compte, <Link style={{color:color.black}} className="underline" href="./signup">Cliquez-ici</Link></Text>
        <Text class="text-3xl font-bold underline" style={{color:color.darkgreen}}>Si vous n'avez pas de compte, <Link style={{color:color.black}} className="underline" href="../[user]/profil">profil</Link></Text>

    </View>
    </SafeAreaView>
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