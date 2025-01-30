import { View,Image, StyleSheet,  Text, KeyboardAvoidingView, Platform, ScrollView, Dimensions, TextInput, TouchableOpacity} from 'react-native'
import { color } from '../../assets/color'
import React, {useState} from 'react'
import { Link, useRouter} from 'expo-router'


const  WIDTH_BTN = Dimensions.get('window').width -56 

const signup = () => {

  const [alertUsername, setAlertUsername] = useState(false)
  const [alertEmail, setAlertEmail] = useState(false)
  const [alertMDP, setAlertMDP] = useState(false)
  const [msgErreur, setMsgErreur] = useState("")
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({username:"",email:"",password:""})
  const router = useRouter()


  return (

    <KeyboardAvoidingView 
    className="flex-1 "
    style={{backgroundColor:color.background}}
    keyboardVerticalOffset={0}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  >
    <View className={`flex-1 items-center`} style={{ backgroundColor: color.background}}>
            <View>
              <Text className="text-5xl tracking-[4px]  pt-24 pb-2 mb-[-20] mt-[50]" style={{color:color.black}}>Votre animal </Text>
              <Text className="text-5xl tracking-[4px] mb-[-10]" style={{ color:color.black }}>mérite </Text>  
              <Text className="text-5xl font-bold " style={{color:color.black}}>le meilleur ... </Text>
              <Text className="text-xl  font-semibold pb-2  mb-[70]" style={{color:color.lightgreen}}>Inscrivez-vous maintenant. C'est gratuit! 🐶</Text>

                <View className="border-2 rounded-lg mb-8" style={{color: color.darkgreen }}>
                <View className="absolute z-10 -top-2.5 left-4 w-auto px-1" style={{backgroundColor:color.background, color: color.darkgreen}}><Text className="w-auto" style={{color: color.darkgreen }}> Prénom </Text>
                </View>

                        <TextInput
                        className="justify-center py-4 rounded-lg text-center "
                        style={[{width: WIDTH_BTN,  color: color.darkgreen, backgroundColor: color.background}]}
                        placeholder='Entrez votre prénom'
                        placeholderTextColor={color.darkgreen}
                        value={form.firstname}
                        />
                    </View>
                

                <View className="border-2 rounded-lg mb-8" style={{color: color.darkgreen }}>
                <View className="absolute z-10 -top-2.5 left-4 w-auto px-1" style={{backgroundColor:color.background, color: color.darkgreen}}><Text className="w-auto" style={{color: color.darkgreen }}> Nom  </Text>
                </View>

                        <TextInput
                        className="justify-center py-4 rounded-lg text-center "
                        style={[{width: WIDTH_BTN,  color: color.darkgreen, backgroundColor: color.background}]}
                        placeholder='Entrez votre nom'
                        placeholderTextColor={color.darkgreen}
                        value={form.lastname}
                        />
                  </View>

                <View className="border-2 rounded-lg mb-8" style={{color: color.darkgreen }}>
                <View className="absolute z-10 -top-2.5 left-4 w-auto px-1" style={{backgroundColor:color.background, color: color.darkgreen}}><Text className="w-auto" style={{color: color.darkgreen }}> Pseudo  </Text>
                </View>

                        <TextInput
                        className="justify-center py-4 rounded-lg text-center "
                        style={[{width: WIDTH_BTN,  color: color.darkgreen, backgroundColor: color.background}]}
                        placeholder='Entrez votre pseudo '
                        placeholderTextColor={color.darkgreen}
                        value={form.username}
                        />
                  </View>

                  <View className="border-2 rounded-lg mb-8" style={{color: color.darkgreen }}>
                <View className="absolute z-10 -top-2.5 left-4 w-auto px-1" style={{backgroundColor:color.background, color: color.darkgreen}}><Text className="w-auto" style={{color: color.darkgreen }}> Courriel  </Text>
                </View>

                        <TextInput
                        className="justify-center py-4 rounded-lg text-center "
                        style={[{width: WIDTH_BTN,  color: color.darkgreen, backgroundColor: color.background}]}
                        placeholder='Entrez votre courriel '
                        placeholderTextColor={color.darkgreen}
                        value={form.email}
                        />
                  </View>

                  <View className="border-2 rounded-lg mb-8" style={{color: color.darkgreen }}>
                <View className="absolute z-10 -top-2.5 left-4 w-auto px-1" style={{backgroundColor:color.background, color: color.darkgreen}}><Text className="w-auto" style={{color: color.darkgreen }}> Mot de passe  </Text>
                </View>

                        <TextInput
                        className="justify-center py-4 rounded-lg text-center "
                        style={[{width: WIDTH_BTN,  color: color.darkgreen, backgroundColor: color.background}]}
                        placeholder='Entrez votre mot de passe '
                        placeholderTextColor={color.darkgreen}
                        value={form.password}
                        />
                  </View>
               
                <TouchableOpacity className=" py-4 rounded-xl px-7 mt-[40]" style={[{width:WIDTH_BTN, backgroundColor:color.darkgreen}]} >
                    <Text className="text-center font-medium text-2xl"  style={{color:color.background}}>Créez le compte</Text>
                </TouchableOpacity>
                <View className="items-center">
                <Text class="text-3xl font-bold underline " style={{color:color.darkgreen}}>Si vous avez déja un compte, <Link style={{color:color.black}} className="underline" href="./signin">connectez-vous</Link></Text>
                </View>
    </View>
    </View>
    </KeyboardAvoidingView>
  )
}

export default signup