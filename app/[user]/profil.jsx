import { View,Image, StyleSheet,  Modal, Text, KeyboardAvoidingView, Platform, ScrollView, Dimensions, TextInput, TouchableOpacity} from 'react-native'
import React, { useState, useEffect , useCallback} from 'react'
import { color } from '../../assets/color'
import { useRouter , useFocusEffect} from 'expo-router';
import { useTheme } from "../../contexts/ThemeContext"
import { getUser, setToken, updateUser, deleteUserById} from '../../lib/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const WIDTH_BTN = Dimensions.get('window').width -56;


const profil = () => {
    const [firstname, setFirstName] = useState('Default');
    const [lastname, setLastName] = useState('Default')
    const [username, setUsername] = useState("Default");
    const [email, setEmail] = useState('default@abc.ca');
    const [profilePic, setProfilePic] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();
    const { theme } = useTheme()
    const colors = color[theme]
    const [showModal, setShowModal] = useState(false); 


    useFocusEffect(
      useCallback(() => {
      const loadData = async () => {
        try {
          const profileData = await getUser();
          if (!profileData) throw new Error('Failed fetching data -> no Data');
          setUsername(profileData.username);
          setEmail(profileData.email);
          setFirstName(profileData.firstname);
          setLastName(profileData.lastname);
          const photo = await AsyncStorage.getItem('photo');
          if (photo) setProfilePic(photo); 
        } catch (error) {
          console.log('Profile: Failed loading profile data:', error);
          router.push("/auth/signin");
          console.log("Plante profile : Failed", error);
        }
      };
      loadData();
    }, []) 
  );


  const logOut = () => {
    setToken('');
    router.push('/');
  };

  const supprimerUser = async () => {
    try {
      const profileData = await getUser();
      await deleteUserById(profileData.id);
      logOut();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCameraPress = () => {
        router.push("../camera");
      };


  const handleSaveUser = async () => {
    try {
        const profileData = await getUser();
        console.log('Profile Data:', profileData);
        
        
            await updateUser(profileData.id, username, firstname, lastname, email); 


            setIsEditing(false);
            setMessageVisible(true);
            setIsEditSuccess(true);
            console.log('User updated successfully');
       
            setIsEditSuccess(false);
            setMessageVisible(true);
            
            
        
    } catch (error) {
        setIsEditSuccess(false);
        setMessageVisible(true);
        console.error('Failed to update user:', error);
    }
} 

const showDeleteConfirmation = () => {
  setShowModal(true); 
};

const hideDeleteConfirmation = () => {
  setShowModal(false); 
};


  return (

    <ScrollView style={{backgroundColor:colors.background_w}}>
        <View className="flex-1 items-center" > 
        <View className="justify-center items-center py-5">
        <TouchableOpacity
            onPress={handleCameraPress}
            className="rounded-full "
            disabled={!isEditing}
            style={isEditing ? { borderWidth: 4, borderColor: colors.orange } : {}}
          >
            {profilePic !== "" ? (
              <Image
                className="w-[200] h-[200] rounded-full"
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
                value={username}
                onChangeText={(item) => { setUsername(item);  
                }}
                placeholder={'username'}
                placeholderTextColor={colors.blue}
              
              />
            )}

          </View>
          <View className="items-center mb-[20]">
                {!isEditing ? (
              <Text className="" style={{ color: colors.black }}> Prénom : {firstname}</Text>
            ) : (
              <TextInput
                className="justify-center text-center text-4xl font-medium px-16"
                style={[{ color: color.blue, backgroundColor: colors.background }]}
                value={firstname}
                onChangeText={(item) => { setFirstName(item);  
                }}
                placeholder={'firstname'}
                placeholderTextColor={colors.blue}
              
              />
            )}
            
               {!isEditing ? (
                
              <Text className="" style={{ color: colors.black }}> Nom : {lastname}</Text>
            ) : (
              <TextInput
                className="justify-center text-center text-4xl font-medium px-16"
                style={[{ color: color.blue, backgroundColor: colors.background }]}
                value={lastname}
                onChangeText={(item) => { setLastName(item);  
                }}
                placeholder={'lastname'}
                placeholderTextColor={colors.blue}
              
              />
            )}
              {!isEditing ? (
              <Text className="" style={{ color: colors.black }}> Courriel : {email}</Text>
            ) : (
              <TextInput
                className="justify-center text-center text-4xl font-medium px-16"
                style={[{ color: color.blue, backgroundColor: colors.background }]}
                value={email}
                onChangeText={(item) => { setEmail(item);  
                }}
                placeholder={'email'}
                placeholderTextColor={colors.blue}
              
              />
            )}
            
          </View>
          <View className="mb-[50]" style={{ padding: 20,  }}>
          <View style={{ flexDirection: '', justifyContent: 'space-between', marginBottom: 10 }}>
          
          <TouchableOpacity className={"py-2 pb-4 px-8 "} style={[{width:WIDTH_BTN}]} onPress={() => setIsEditing(!isEditing)}>
                <Text className="text-center font-xl text-2xl p-3 rounded-xl " style={[{backgroundColor: colors.blue, color: colors.background}] }> Modifier vos info</Text>
            </TouchableOpacity>
           {isEditing && (
          <TouchableOpacity className={"py-2 pb-4 px-8 "} onPress={handleSaveUser} style={[{  width: WIDTH_BTN}]}>
            <Text className="text-center font-xl text-2xl p-3 rounded-xl " style={{ color: colors.background_w , backgroundColor: colors.orange}}>Save</Text>
          </TouchableOpacity>
        )}

            <TouchableOpacity className={"py-2 pb-4 px-8"} style={[{width:WIDTH_BTN}]} onPress={() => { router.push("./addPet") }}>
                <Text className="text-center font-xl text-2xl p-3 rounded-xl " style={[{backgroundColor: colors.blue, color: colors.background}] }> Ajouter un animal</Text>
            </TouchableOpacity>
            <TouchableOpacity className={"py-2 pb-4 px-8"} style={[{width:WIDTH_BTN}]} onPress={() => { router.push("./myAnimal") }}>
                <Text className="text-center font-xl text-2xl p-3 rounded-xl " style={[{backgroundColor: colors.blue, color: colors.background}] }> Mes animaux</Text>
            </TouchableOpacity>
            <TouchableOpacity className={"py-2 pb-4 px-8"} style={[{width:WIDTH_BTN}]} onPress={showDeleteConfirmation}>
                <Text className="text-center font-xl text-2xl p-3 rounded-xl " style={[{backgroundColor: colors.blue, color: colors.background}] }> Supprimer votre compte</Text>
            </TouchableOpacity>
            <TouchableOpacity className={"py-2 pb-4 px-8"} style={[{width:WIDTH_BTN}]} onPress={logOut}>
                <Text className="text-center font-xl text-2xl p-3 rounded-xl " style={[{backgroundColor: colors.orange, color: colors.background}] }> Déconnexion</Text>
            </TouchableOpacity>
          </View>

          </View>
          <Modal
          visible={showModal}
          animationType="fade"
          transparent={true}
          onRequestClose={hideDeleteConfirmation}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text className="text-xl"style={{ color: colors.black}}>Êtes-vous sûr de vouloir supprimer votre compte ?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity className="py-[10] w-[120] rounded-xl"onPress={supprimerUser} style={{backgroundColor: colors.orange}}>
                  <Text className="text-center"style={{color : colors.background_w}}>Oui</Text>
                </TouchableOpacity>
                <TouchableOpacity className="py-[10] w-[120] rounded-xl" onPress={hideDeleteConfirmation} style={{backgroundColor: colors.orange}}>
                  <Text  className="text-center"style={{color : colors.background_w}}>Non</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

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
    modalBackground: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      width: 300,
      alignItems: 'center',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
      width: '100%',
    },


});

export default profil