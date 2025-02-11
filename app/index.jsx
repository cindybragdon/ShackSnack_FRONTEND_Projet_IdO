

import { Text, View, Image, TouchableOpacity, StyleSheet, Dimensions} from 'react-native'
import React, { useState, useEffect } from 'react'
import "../global.css"; 
import * as Font from 'expo-font';
import { useRouter, Link } from 'expo-router'
import { color } from '../assets/color'
import { useTheme } from "../contexts/ThemeContext"

const index = () => {

    const [fontLoaded, setFontLoaded] = useState(false);
    const router = useRouter()
    const { theme } = useTheme()
    const colors = color[theme]
    const  WIDTH_BTN = Dimensions.get('window').width - 56

    
    useEffect(() => {
      async function loadFont() {
        await Font.loadAsync({
          'cookie': require('../assets/font/Cookie-Regular.ttf'),
        });
        setFontLoaded(true);
      }
  
      loadFont();
    }, []);


    return (
        <View className={`flex-1 items-center`} style={{ backgroundColor: colors.background_w}}>


            <Image
                className="mt-[180]"
                source={require('../assets/images/homedogcat.png')}
                style={styles.image}
            />
            
            <Text className={`text-5xl uppercase font-bold text-center tracking-[4px] mb-[-20] `} style={{ color: colors.black}}>
                the
            </Text>            
            <Text className={`text-7xl text-center tracking-[4px] mb-[-16]`} style={{ fontFamily: 'cookie', color: colors.blue}}>
                snack
            </Text>            
            <Text className={`text-5xl uppercase font-bold text-center tracking-[4px] mb-[2]`} style={{ color:colors.black}}>
                shack
            </Text>
            <Text className={`text-xs uppercase font-bold text-center tracking-[4px] mb-[80] animate-bounce`} style={{ color: colors.orange}}>
             Miam en un clic !
            </Text>
                  <TouchableOpacity className={"py-2 pb-4 px-8"} style={[{width:WIDTH_BTN}]} onPress={() => { router.push("./auth/signin") }}>
                      <Text className="text-center font-xl text-3xl p-3 rounded-xl " style={[{backgroundColor: colors.blue, color: colors.background}] }>Se connecter</Text>
                  </TouchableOpacity>
        
                  <Text class="text-3xl font-bold underline" style={{color:colors.black}}>Si vous n'avez pas de compte, <Link style={{color:colors.orange}}  href="./auth/signup">Sign-up</Link></Text>


        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        height: 200,
        width: 200,
        resizeMode: 'contain',
    },
});

export default index;
 