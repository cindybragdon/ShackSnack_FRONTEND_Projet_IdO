
import { StyleSheet, Text, View } from 'react-native'
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomHeader from '../components/CustomHeader';
import { ThemeProvider } from '../contexts/ThemeContext';


const RootLayout = () => {
  return (
    <ThemeProvider>

        <Layout />

    </ThemeProvider>
  );
};


const Layout = () => {

    return (
      <>
          <GestureHandlerRootView className="flex-1" >
            <Drawer 
                screenOptions={{
                  swipeEnabled:false,
                 // headerShown:false,
                 header: ({navigation}) => <CustomHeader navigation={navigation} tabName={""} />

                }
              }>
                <Drawer.Screen name="index" options={{headerShown:false,  title:"Page d'acceuil", drawerItemStyle: { display: '' } }} />
                <Drawer.Screen name="auth" options={{title:"Signin", headerShown:false, drawerItemStyle: { display: 'none' }  }}/>
                <Drawer.Screen name="[user]/profil" options={{title:"Profil"}}/>
                <Drawer.Screen name="[user]/setting" options={{title:"Settings"}}/>
                <Drawer.Screen name="[user]/addPet" options={{title:"Ajouter un animal"}}/>
                <Drawer.Screen name="[user]/animalProfil" options={{title:"Profil de vos animaux"}}/>
                <Drawer.Screen name="[user]/myAnimal" options={{title: "Vos animaux"}}/>
                <Drawer.Screen name="camera/index" options={{headerShown:false, drawerItemStyle: { display: 'none' }}}/>
                <Drawer.Screen name="camera1/index" options={{headerShown:false, drawerItemStyle: { display: 'none' }}}/>
                <Drawer.Screen name="[user]/statsScreen" options={{title:"Graphique"}}/>

            </Drawer>
          </GestureHandlerRootView>
      </>
    )
  }

export default RootLayout