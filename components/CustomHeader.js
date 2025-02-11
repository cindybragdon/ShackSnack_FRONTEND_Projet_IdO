// CustomDrawerHeader.js
import React from 'react';
import {Text, StyleSheet,TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { color } from "../assets/color"
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useTheme } from "../contexts/ThemeContext"



const CustomHeader = ({navigation, tabName}) => {

  const { theme } = useTheme()
  const colors = color[theme]

  return (
    <SafeAreaView style={[styles.header,{backgroundColor:colors.background_w}]}>

<TouchableOpacity style={[styles.content]} onPress={() => {navigation.openDrawer();}}>
        <Text>
            <Icon name="bars" size={30} color={color.blue}/>
        </Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width:'100%',
    justifyContent:'space-between'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content:{
    heigth:56,
    width:56,
    justifyContent:"center",
    alignItems:"center",
    fontSize:30
  }
});

export default CustomHeader;