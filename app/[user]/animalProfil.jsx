import { View, Text, TouchableOpacity, Dimensions, TextInput, Image, StyleSheet, Modal } from 'react-native';
import React, { useState, useCallback } from 'react';
import { color } from '../../assets/color';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useTheme } from "../../contexts/ThemeContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUser, getAnimals, getSubdocumentById, updateSubdocument, setAnimals, deleteSubdocument } from '../../lib/axios';
import { resetToDefaults } from '@testing-library/react-native';
const WIDTH_BTN = Dimensions.get('window').width - 56;

const animalProfil = () => {
    const router = useRouter();
    const { theme } = useTheme();
    const colors = color[theme];

    const [animalPic, setAnimalPic] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [type_animal, setType] = useState('');
    const [weight, setWeight] = useState('');
    const [birth_date, setBirthDate] = useState('');
    const [number_sec_treats, setTreats] = useState('');
    const [number_sec_food, setMeal] = useState('');
    const [userId, setUserId] = useState(null);
    const [animalId, setAnimalId] = useState(null);
    const params = useLocalSearchParams();
    const [showModal, setShowModal] = useState(false); 

    const handleCameraPress = () => {
        router.push("../camera1");
    };

    const updateAnimal = async () => {
        try {
            await AsyncStorage.setItem('photoAnimal', animalPic);
            const userData = await getUser();
            const animalData ={name, nickname, type_animal, weight, birth_date, number_sec_treats, number_sec_treats}

            const resp = await updateSubdocument(userData.id, 'animals', id, animalData)
             await setAnimals (resp.animals)
            console.log("Photo saved successfully!");
            setIsEditing(false);
        } catch (error) {
            console.log("Failed to save photo", error);
        }
    };


    const { id = '' } = params;

    const fetchUserAndAnimalDetails = async () => {
        setAnimalPic('');
        setName('');
        setNickname('');
        setType('');
        setWeight('');
        setBirthDate('');
        setTreats('');
        setMeal('');

        try {
            const userData = await getUser();
            const userAnimals = await getAnimals();

            if (userData && userAnimals && userAnimals.length > 0) {
                setUserId(userData.id);

                const animalDetails = await getSubdocumentById(userData.id, 'animals', id);
                const photo1 = await AsyncStorage.getItem('photoAnimal');

                if (animalDetails) {
                    if (photo1) setAnimalPic(photo1);

                    setName(animalDetails.name || '');
                    setNickname(animalDetails.nickname || '');
                    setType(animalDetails.type_animal || '');
                    setWeight(animalDetails.weight || '');
                    setBirthDate(animalDetails.birth_date || '');
                    setTreats(animalDetails.number_sec_treats || '');
                    setMeal(animalDetails.number_sec_food || '');
                }
            }
        } catch (error) {
            console.error("Error fetching user or animal details:", error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchUserAndAnimalDetails(); 
        }, [id])
    );


    const supprimerAnimal = async () => {
        try {
            const userData = await getUser();
        
            await deleteSubdocument(userData.id,'animals', id)
            const animals = await getAnimals();
            const updatedAnimalList = animals.filter(animal => animal._id != id)
            await setAnimals (updatedAnimalList)
            hideDeleteConfirmation();
            router.push('./myAnimal')

        }
        catch (error) {
            console.log(error);
        }
    }


    const showDeleteConfirmation = () => {
        setShowModal(true); 
      };
      
      const hideDeleteConfirmation = () => {
        setShowModal(false); 
      };

    return (
        <View className="flex-1" style={{ backgroundColor: colors.background_w }}>
            <View className="p-12 items-center">
                <TouchableOpacity
                    onPress={handleCameraPress}
                    className="rounded-full"
                    disabled={!isEditing}
                    style={isEditing ? { borderWidth: 4, borderColor: colors.blue } : {}}
                >
                    {animalPic !== "" ? (
                        <Image
                            className="w-[200] h-[200] rounded-full"
                            source={{ uri: animalPic }}
                        />
                    ) : (
                        <View className="w-[200] h-[200] rounded-full bg-gray-400 justify-center items-center mb-[2]" style={{ backgroundColor: colors.orange }}>
                            <Text className="text-white font-bold">Pas de photo</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {!isEditing ? (
                    <Text className="text-4xl font-medium uppercase mt-[30]" style={{ color: colors.orange }}> {name}</Text>
                ) : (
                    <TextInput
                        className="justify-center text-center text-4xl font-medium px-16"
                        style={[{ color: color.blue, backgroundColor: colors.background }]}
                        value={name}
                        onChangeText={(item) => { setName(item); }}
                        placeholder={'name'}
                        placeholderTextColor={colors.blue}
                    />
                )}

                {!isEditing ? (
                    <Text className="text-2xl" style={{ color: colors.black }}>Surnom: {nickname}</Text>
                ) : (
                    <TextInput
                        className="justify-center text-center text-4xl font-medium px-16"
                        style={[{ color: color.blue, backgroundColor: colors.background }]}
                        value={nickname}
                        onChangeText={(item) => { setNickname(item); }}
                        placeholder={'nickname'}
                        placeholderTextColor={colors.blue}
                    />
                )}

                {!isEditing ? (
                    <Text className="text-2xl" style={{ color: colors.black }}>Type: {type_animal}</Text>
                ) : (
                    <TextInput
                        className="justify-center text-center text-4xl font-medium px-16"
                        style={[{ color: color.blue, backgroundColor: colors.background }]}
                        value={type_animal}
                        onChangeText={(item) => { setType(item); }}
                        placeholder={'type'}
                        placeholderTextColor={colors.blue}
                    />
                )}

                {!isEditing ? (
                    <Text className="text-2xl" style={{ color: colors.black }}>Poids: {weight}</Text>
                ) : (
                    <TextInput
                        className="justify-center text-center text-4xl font-medium px-16"
                        style={[{ color: color.blue, backgroundColor: colors.background }]}
                        value={weight}
                        onChangeText={(item) => { setWeight(item); }}
                        placeholder={'weight'}
                        placeholderTextColor={colors.blue}
                        keyboardType='numeric'
                    />
                )}

                {!isEditing ? (
                    <Text className="text-2xl" style={{ color: colors.black }}>Date de naissance: {birth_date}</Text>
                ) : (
                    <TextInput
                        className="justify-center text-center text-4xl font-medium px-16"
                        style={[{ color: color.blue, backgroundColor: colors.background }]}
                        value={birth_date}
                        onChangeText={(item) => { setBirthDate(item); }}
                        placeholder={'birth_date'}
                        placeholderTextColor={colors.blue}
                        keyboardType='numeric'
                    />
                )}

                {!isEditing ? (
                    <Text className="text-2xl" style={{ color: colors.black }}>Gâterie (secondes): {number_sec_treats}</Text>
                ) : (
                    <TextInput
                        className="justify-center text-center text-4xl font-medium px-16"
                        style={[{ color: color.blue, backgroundColor: colors.background }]}
                        value={number_sec_treats}
                        onChangeText={(item) => { setTreats(item); }}
                        placeholder={'treats'}
                        placeholderTextColor={colors.blue}
                        keyboardType='numeric'
                    />
                )}

                {!isEditing ? (
                    <Text className="text-2xl" style={{ color: colors.black }}>Repas (secondes): {number_sec_food}</Text>
                ) : (
                    <TextInput
                        className="justify-center text-center text-4xl font-medium px-16"
                        style={[{ color: color.blue, backgroundColor: colors.background }]}
                        value={number_sec_food}
                        onChangeText={(item) => { setMeal(item); }}
                        placeholder={'meal'}
                        placeholderTextColor={colors.blue}
                        keyboardType='numeric'
                    />
                )}

                <TouchableOpacity className={"py-2 pb-4 px-8 mt-[100] "} style={[{ width: WIDTH_BTN }]} onPress={() => setIsEditing(!isEditing)}>
                    <Text className="text-center font-xl text-2xl p-3 rounded-xl" style={[{ backgroundColor: colors.blue, color: colors.background }]}>Modifier vos info</Text>
                </TouchableOpacity>

                {isEditing && (
                    <TouchableOpacity className={"py-2 pb-4 px-8 "} onPress={updateAnimal} style={[{ width: WIDTH_BTN }]}>
                        <Text className="text-center font-xl text-2xl p-3 rounded-xl" style={{ color: colors.background_w, backgroundColor: colors.orange }}>Save</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity className={"py-2 pb-4 px-8"} style={[{width:WIDTH_BTN}]} onPress={showDeleteConfirmation}>
                <Text className="text-center font-xl text-2xl p-3 rounded-xl " style={[{backgroundColor: colors.blue, color: colors.background}] }> Supprimer un animal</Text>
            </TouchableOpacity>
            </View>
            <Modal
          visible={showModal}
          animationType="fade"
          transparent={true}
          onRequestClose={hideDeleteConfirmation}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text className="text-xl"style={{ color: colors.black}}>Êtes-vous sûr de vouloir supprimer cette animal ?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity className="py-[10] w-[120] rounded-xl"onPress={supprimerAnimal} style={{backgroundColor: colors.orange}}>
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
    );
};

const styles = StyleSheet.create({
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

export default animalProfil;

      useFocusEffect(
        useCallback(() => {
          const loadData = async () => {
            try {
              const photo1 = await AsyncStorage.getItem('photoAnimal');
              if (photo1) setPlantePic(photo1);
              
              setName(myplant_name); 
              setNickname();
              setType(myplant_type); 
              setWeight();
              setBirthDate(); 
              setTreats();
              setMeal();
            } catch (error) {
              console.log("Profil de l'animal : non abouti", error);
            }
          };
    
          loadData();
        }, []) 
      );



  return (
    <View className="flex-1"style={{backgroundColor: colors.background_w}}> 
        <View className="p-12 items-center">
        <TouchableOpacity
          onPress={handleCameraPress}
          className="rounded-full"
          disabled={!isEditing}
          style={isEditing ? { borderWidth: 4, borderColor: colors.blue } : {}}
        >
             {animalPic !== "" ? (
              <Image
                className="w-[200] h-[200] rounded-full"
                source={{ uri: animalPic }}
              />
          ) : (
            <View className="w-[200] h-[200] rounded-full bg-gray-400 justify-center items-center mb-[2]" style={{backgroundColor:colors.orange}}>
              <Text className="text-white font-bold">Pas encore de photo</Text>
            </View>
          )}
        </TouchableOpacity>
        {!isEditing ? (
              <Text className="text-4xl font-medium uppercase mt-[30]" style={{ color: colors.orange }}>Prénom: {name}</Text>
            ) : (
              <TextInput
                className="justify-center text-center text-4xl font-medium px-16"
                style={[{ color: color.blue, backgroundColor: colors.background }]}
                value={name}
                onChangeText={(item) => { setName(item);  
                }}
                placeholder={'Nom'}
                placeholderTextColor={colors.blue}
              
              />
            )}
            {!isEditing ? (
              <Text className="text-2xl" style={{ color: colors.black }}> Surnom : {nickname}</Text>
            ) : (
              <TextInput
                className="justify-center text-center text-4xl font-medium px-16"
                style={[{ color: color.blue, backgroundColor: colors.background }]}
                value={nickname}
                onChangeText={(item) => { setNickname(item);  
                }}
                placeholder={'Surnom'}
                placeholderTextColor={colors.blue}
              
              />
            )}            
            {!isEditing ? (
                <Text className="text-2xl" style={{ color: colors.black }}> Type : {type}</Text>
              ) : (
                <TextInput
                  className="justify-center text-center text-4xl font-medium px-16"
                  style={[{ color: color.blue, backgroundColor: colors.background }]}
                  value={type}
                  onChangeText={(item) => { setType(item);  
                  }}
                  placeholder={'type'}
                  placeholderTextColor={colors.blue}
                
                />
              )}
                {!isEditing ? (
                <Text className="text-2xl" style={{ color: colors.black }}> Poids : {weight}</Text>
              ) : (
                <TextInput
                  className="justify-center text-center text-4xl font-medium px-16"
                  style={[{ color: color.blue, backgroundColor: colors.background }]}
                  value={weight}
                  onChangeText={(item) => { setWeight(item);  
                  }}
                  placeholder={'Poids'}
                  placeholderTextColor={colors.blue}
                   keyboardType='numeric'
                />
              )}
                {!isEditing ? (
                <Text className="text-2xl" style={{ color: colors.black }}> Date de naissance : {birth_date}</Text>
              ) : (
                <TextInput
                  className="justify-center text-center text-4xl font-medium px-16"
                  style={[{ color: color.blue, backgroundColor: colors.background }]}
                  value={birth_date}
                  onChangeText={(item) => { setBirthDate(item);  
                  }}
                  placeholder={'Date de naissance'}
                  placeholderTextColor={colors.blue}
                   keyboardType='numeric'
                />
              )}
              {!isEditing ? (
                <Text className="text-2xl" style={{ color: colors.black }}> Gâterie (seconde): {treats}</Text>
              ) : (
                <TextInput
                  className="justify-center text-center text-4xl font-medium px-16"
                  style={[{ color: color.blue, backgroundColor: colors.background }]}
                  value={treats}
                  onChangeText={(item) => { setTreats(item);  
                  }}
                  placeholder={'Gâteries'}
                  placeholderTextColor={colors.blue}
                   keyboardType='numeric'
                />
              )}
                {!isEditing ? (
                <Text className="text-2xl" style={{ color: colors.black }}> Repas (seconde): {meal}</Text>
              ) : (
                <TextInput
                  className="justify-center text-center text-4xl font-medium px-16"
                  style={[{ color: color.blue, backgroundColor: colors.background }]}
                  value={meal}
                  onChangeText={(item) => { setMeal(item);  
                  }}
                  placeholder={'Repas'}
                  placeholderTextColor={colors.blue}
                   keyboardType='numeric'
                />
              )}

      <TouchableOpacity className={"py-2 pb-4 px-8 mt-[150] "} style={[{width:WIDTH_BTN}]} onPress={() => setIsEditing(!isEditing)}>
                <Text className="text-center font-xl text-2xl p-3 rounded-xl " style={[{backgroundColor: colors.blue, color: colors.background}] }> Modifier vos info</Text>
            </TouchableOpacity>
           {isEditing && (
          <TouchableOpacity className={"py-2 pb-4 px-8 "} onPress={updateAnimal} style={[{  width: WIDTH_BTN}]}>
            <Text className="text-center font-xl text-2xl p-3 rounded-xl " style={{ color: colors.background_w , backgroundColor: colors.orange}}>Sauvegarder</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default animalProfil

