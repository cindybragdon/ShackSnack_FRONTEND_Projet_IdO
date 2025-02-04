import { View,Image, StyleSheet,  Text, KeyboardAvoidingView, Platform, ScrollView, Dimensions, TextInput, TouchableOpacity} from 'react-native'
import React, { useState, useEffect } from 'react'
import { color } from '../../assets/color'
import { useRouter } from 'expo-router';


const WIDTH = Dimensions.get('window').width;


const profil = () => {

    const [username, setUsername] = useState("Default");
    const [email, setEmail] = useState('default@abc.ca');
    const [profilePic, setProfilePic] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();



    const handleCameraPress = () => {
        router.push("../camera");
      };


  return (

    <ScrollView style={{backgroundColor:color.background }}>
        <View className="flex-1 items-center" > 
        <View className="justify-center items-center py-5">
        <TouchableOpacity
            onPress={handleCameraPress}
            className="rounded-full"
            disabled={!isEditing}
            style={isEditing ? { borderWidth: 4, borderColor: color.pink } : {}}
          >
            {profilePic !== "" ? (
              <Image
                
                source={{ uri: profilePic }}
              />
            ) : (
                <View style={[styles.profileImage, { backgroundColor: color.darkgreen }]}>
                <Text className="font-bold" style={{color:color.background}}>Pas de photo</Text>
              </View>
            )}
          </TouchableOpacity>
            </View>
            <View className="mt-10">
            {!isEditing ? (
              <Text className="text-4xl font-medium px-16" style={{ color: color.darkgreen }}>{username}</Text>
            ) : (
              <TextInput
                className="justify-center text-center text-4xl font-medium px-16"
                style={[{ color: color.darkgreen, backgroundColor: color.background }]}
                onChangeText={(item) => { setUsername(item); }}
                placeholder={'username'}
                placeholderTextColor={color.darkgreen}
                value={username}
              />
            )}

          </View>
          <View>
                <Text> {email} </Text>
          </View>
          <View className="mb-[50]" style={{ padding: 20, backgroundColor: color.background }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
          
          <TouchableOpacity
            className=""
            onPress={() => setIsEditing(!isEditing)}
            style={{
              backgroundColor: color.darkgreen,
              padding: 12,
              borderRadius: 12,
              marginLeft: 5,
              alignItems: 'center',
            }}>
            <Text className="text-xl"style={{ color: color.background }}>Modifier</Text>
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
    }
});

export default profil