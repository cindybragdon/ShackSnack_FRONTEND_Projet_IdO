import { CameraView , useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import {useRouter } from "expo-router"
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const cameraRef = useRef(null); 
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

    const takeAPhoto = async () => {
      if (cameraRef.current) {
        const photoData = await cameraRef.current.takePictureAsync();
        console.log(photoData.uri);
  
        await AsyncStorage.setItem('photo', photoData.uri);
        router.push('../[user]/profile');
      }
    };
  return (
    <View className="flex-1">
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View className="flex-1 justify-end">
          <View className="flex-row justify-end items-center mb-32">
            <TouchableOpacity className="w-32 h-32 bg-black rounded-full items-center justify-center mx-10" onPress={toggleCameraFacing}>
              <Text style={styles.text}>Flip</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-32 h-32 bg-black rounded-full items-center justify-center mx-10" onPress={(takePictureAsync)=>{takeAPhoto(takePictureAsync)}}>
              <Text className="text-white" >Take a photo</Text>
            </TouchableOpacity>
          </View>
          <View>
            
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
