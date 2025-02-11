import { View,Image, StyleSheet,  Text, KeyboardAvoidingView, Platform, ScrollView, Dimensions, TextInput, TouchableOpacity} from 'react-native'
import React, { useState, useEffect } from 'react'
import { color } from '../../assets/color'
import { useRouter } from 'expo-router';
import { useTheme } from "../../contexts/ThemeContext"



const WIDTH_BTN = Dimensions.get('window').width -56;


const profil = () => {
    const [firstname, setFirstName] = useState('Default');
    const [lastName, setLastName] = useState('Default')
    const [username, setUsername] = useState("Default");
    const [email, setEmail] = useState('default@abc.ca');
    const [profilePic, setProfilePic] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();
    const { theme } = useTheme()
    const colors = color[theme]



    const handleCameraPress = () => {
        router.push("../camera");
      };


  return (

    <ScrollView style={{backgroundColor:colors.background_w}}>
        <View className="flex-1 items-center" > 
        <View className="justify-center items-center py-5 mt-[50]">
        <TouchableOpacity
            onPress={handleCameraPress}
            className="rounded-full "
            disabled={!isEditing}
            style={isEditing ? { borderWidth: 4, borderColor: colors.orange } : {}}
          >
            {profilePic !== "" ? (
              <Image
                
                source={{ uri: profilePic }}
              />
            ) : (
                <View style={[styles.profileImage, { backgroundColor: colors.blue }]}>
                <Text className="font-bold" style={{color:colors.background}}>Pas de photo</Text>
              </View>
            )}
          </TouchableOpacity>
            </View>
            <View className="mt-10">
            {!isEditing ? (
              <Text className="text-4xl font-medium uppercase" style={{ color: colors.orange }}>{username}</Text>
            ) : (
              <TextInput
                className="justify-center text-center text-4xl font-medium px-16"
                style={[{ color: color.blue, backgroundColor: colors.background }]}
                onChangeText={(item) => { setUsername(item); }}
                placeholder={'username'}
                placeholderTextColor={colors.blue}
                value={username}
              />
            )}

          </View>
          <View className="items-center mb-[20]">
                <Text style={{color: colors.black}}> {firstname}</Text>
                <Text style={{color: colors.black}}> {lastName}</Text>
                <Text style={{color: colors.black}}> {email} </Text>
          </View>
          <View className="mb-[50]" style={{ padding: 20,  }}>
          <View style={{ flexDirection: '', justifyContent: 'space-between', marginBottom: 10 }}>
          
          <TouchableOpacity className={"py-2 pb-4 px-8"} style={[{width:WIDTH_BTN}]} onPress={() => setIsEditing(!isEditing)}>
                <Text className="text-center font-xl text-2xl p-3 rounded-xl " style={[{backgroundColor: colors.blue, color: colors.background}] }> Modifier vos info</Text>
            </TouchableOpacity>
            <TouchableOpacity className={"py-2 pb-4 px-8"} style={[{width:WIDTH_BTN}]} onPress={() => { }}>
                <Text className="text-center font-xl text-2xl p-3 rounded-xl " style={[{backgroundColor: colors.blue, color: colors.background}] }> Supprimer votre compte</Text>
            </TouchableOpacity>
            <TouchableOpacity className={"py-2 pb-4 px-8"} style={[{width:WIDTH_BTN}]} onPress={() => { router.push("./addAnimal") }}>
                <Text className="text-center font-xl text-2xl p-3 rounded-xl " style={[{backgroundColor: colors.blue, color: colors.background}] }> Ajouter un animal</Text>
            </TouchableOpacity>
            <TouchableOpacity className={"py-2 pb-4 px-8"} style={[{width:WIDTH_BTN}]} onPress={() => { router.push("./myAnimal") }}>
                <Text className="text-center font-xl text-2xl p-3 rounded-xl " style={[{backgroundColor: colors.blue, color: colors.background}] }> Mes animaux</Text>
            </TouchableOpacity>
          </View>

          </View>

        </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({

    profileImage: {
        width: 200, 
        height: 200, 
        borderRadius: 100, 
        justifyContent: 'center',
        alignItems: 'center',
    },

});

export default profil