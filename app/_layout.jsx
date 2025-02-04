
import { StyleSheet, Text, View } from 'react-native'
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomHeader from '../components/CustomHeader';


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
                <Drawer.Screen name="index" options={{headerShown:false,  title:"Page d'acceuil", drawerItemStyle: { display: 'none' } }} />
                <Drawer.Screen name="auth" options={{title:"Signin", headerShown:false, drawerItemStyle: { display: 'none' }  }}/>
                <Drawer.Screen name="[user]/profil" options={{title:"Profil"}}/>

  
            </Drawer>
          </GestureHandlerRootView>
      </>
    )
  }

export default Layout