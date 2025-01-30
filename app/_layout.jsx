
import { StyleSheet, Text, View } from 'react-native'
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const Layout = () => {

    return (
      <>
          <GestureHandlerRootView className="flex-1" >
            <Drawer 
                screenOptions={{
                  swipeEnabled:false,
                  headerShown:false,
                 
                }
              }>
                <Drawer.Screen name="index" options={{headerShown:false}} />
  
  
  
            </Drawer>
          </GestureHandlerRootView>
      </>
    )
  }

export default Layout