import { View, Text, Dimensions, TouchableOpacity } from 'react-native'
import { useTheme } from '../../contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { color } from '../../assets/color';
import React, { useState, useEffect } from 'react'

const myAnimal = () => {

    const { theme } = useTheme();
    const router = useRouter();
    const colors = color[theme]
    const  WIDTH_BTN = Dimensions.get('window').width - 56
    const [fontLoaded, setFontLoaded] = useState(false);
    const [animal, setAnimal] = useState( {myAnimal : []})

    useEffect(() => {
        async function loadFont() {
          await Font.loadAsync({
            'cookie': require('../../assets/font/Cookie-Regular.ttf'),
          });
          setFontLoaded(true);
        }
    
        loadFont();
      }, []);


      // Fetch et render a faire

  return (

            <View className="items-center flex-1" style={{backgroundColor: colors.background_w}}>
                 <Text className=" font-bold text-3xl mb-[-20]" style={{color: colors.orange}}> vos </Text>
                 <Text className={`text-7xl text-center tracking-[4px] ]`} style={{ fontFamily: 'cookie', color: colors.black}}> Animaux </Text>
                 {animal?.myAnimal?.length > 0 ? (
                <ScrollView contentContainerStyle={{ width: '100%', padding: 10 }}>
                    {animal.myAnimal.map((plant, index) => renderItem({ item: animal, index }))}
                </ScrollView>
                    ) : (
                <Text style={{ color: colors.secondaryText }}>Vous n'avez pas encore ajouter d'animal a votre liste.</Text>
                    )}
                <TouchableOpacity>
                    <Text className="text-center rounded-[12] py-[12] text-2xl"style={{backgroundColor: colors.orange, width: WIDTH_BTN}} onPress={()=> router.push('./[user]/addPet')}> Ajouter un animal</Text>
                </TouchableOpacity>

            </View>


  )
}

export default myAnimal