import { View, Text , KeyboardAvoidingView, Platform} from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRouter  } from 'expo-router'
import { color } from '../../assets/color'
import { useTheme } from '../../contexts/ThemeContext'

const addPet = () => {

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

    <KeyboardAvoidingView
    keyboardVerticalOffset={0}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={[{ backgroundColor: colors.background }]} 
    className="flex-1" >
    <View className="flex-1" style={{backgroundColor: colors.background_w}}>
      <Text className="text-center uppercase font-bold text-3xl mb-[-20]" style={{color: colors.orange}}> Ajouter </Text>
      <Text className="text-center  font-bold text-6xl mb-[-20]" style={{color: colors.black, fontFamily: 'cookie'}}>vos</Text>
      <Text className="text-center uppercase font-bold text-3xl mb-[20]" style={{color: colors.orange}}> Animaux</Text>
    </View>
    </KeyboardAvoidingView>
  )
}

export default addPet