import React, { useEffect } from 'react'
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';



const AuthLayout = () => {
  return (
    <>
        <GestureHandlerRootView className="flex-1" >
          <Stack 
              screenOptions={{
                swipeEnabled:true,
                headerShown:false,
              }
            }>
              
          </Stack>
        </GestureHandlerRootView>
    </>
  )
}

export default AuthLayout