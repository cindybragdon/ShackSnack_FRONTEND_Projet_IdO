import { View, Text, TouchableOpacity , Dimensions, TextInput} from 'react-native'
import React, { useState, useCallback } from 'react'
import { color } from '../../assets/color'
import { useRouter , useFocusEffect} from 'expo-router';
import { useTheme } from "../../contexts/ThemeContext"

const WIDTH_BTN = Dimensions.get('window').width -56;

const animalProfil = () => {
    const router = useRouter();
    const { theme } = useTheme()
    const colors = color[theme]
    const [animalPic, setAnimalPic] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName ] = useState(false)
    const [nickname, setNickname] = useState(false)
    const [type, setType] = useState(false)
    const [weight, setWeight] = useState(false)
    const [birth_date, setBirthDate] = useState(false)
    const [treats, setTreats] = useState(false)
    const [meal, setMeal ] = useState(false)

    const handleCameraPress = () => {
        router.push("../camera1");
      };

      const updateAnimal = async () => {

      }

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
              console.log("Animal profile : Failed", error);
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
                placeholder={'name'}
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
                placeholder={'nickname'}
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
                  placeholder={'weight'}
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
                  placeholder={'birth_date'}
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
                  placeholder={'treats'}
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
                  placeholder={'meal'}
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