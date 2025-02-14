import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import { color } from '../../assets/color'
import { useTheme } from '../../contexts/ThemeContext'
import { useRouter } from 'expo-router'
import { Picker } from '@react-native-picker/picker'; 

const WIDTH_BTN = Dimensions.get('window').width -56;


const Feed = () => {

    const { theme } = useTheme();
    const router = useRouter();
    const colors = color[theme]
    const [fontLoaded, setFontLoaded] = useState(false);

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
    <View className="flex-1 items-center" style={{backgroundColor: colors.background_w}}>
      <Text className="text-center uppercase font-bold text-3xl mb-[-20]" style={{color: colors.orange}}>Feed </Text>
      <Text className="text-center  font-bold text-6xl mb-[-20]" style={{color: colors.black, fontFamily: 'cookie'}}>your</Text>
      <Text className="text-center uppercase font-bold text-3xl mb-[20]" style={{color: colors.orange}}> Animal </Text>
        <View className="h-[300] w-[300] mb-[30] "style={{backgroundColor: colors.black}}>
            <Text className="text-center py-[10]"style={{color: colors.background_w}}> ₍^. .^₎⟆</Text>
        </View>
            <TouchableOpacity className="rounded-xl mb-[20]"style={{backgroundColor : colors.blue ,width: WIDTH_BTN}}>
            <Text className="text-center font-xl text-2xl p-3 rounded-xl" style={[{backgroundColor: colors.blue, color: colors.background}] }> Feed?</Text>
            </TouchableOpacity>

            <TouchableOpacity className="rounded-xl mb-[20]"style={{backgroundColor : colors.blue ,width: WIDTH_BTN}}>
            <Text className="text-center font-xl text-2xl p-3 rounded-xl " style={[{backgroundColor: colors.blue, color: colors.background}] }> No feed D: </Text>
            </TouchableOpacity>
                
            <Text> Liste animal drop down </Text>

    </View>
  )
}

export default Feed