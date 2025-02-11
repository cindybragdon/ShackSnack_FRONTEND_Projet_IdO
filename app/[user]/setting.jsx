import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme} from "../../contexts/ThemeContext"
import Icon from 'react-native-vector-icons/FontAwesome5'; 
import { color } from "../../assets/color"

const Setting = () => {
  const { theme, toggleTheme } = useTheme();
  const iconName = theme === 'light' ? 'moon' : 'sun';

  return (
        <View className="flex-1 items-center">
        
        <Text className="uppercase text-2xl "> Paramètres </Text>


      <TouchableOpacity onPress={toggleTheme}>
        <Text>
          <Icon name={theme === 'light' ? "moon" : "sun"} size={30} color={color.orange} />
        </Text>
      </TouchableOpacity>

        </View>
  );
};


export default Setting;
