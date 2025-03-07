import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Switch, Button, FlatList, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from "react-native";
import { getUser, updateSubdocument, createSubdocument, setUserDevice, getUserDevice } from "../../lib/axios";
import { color } from '../../assets/color'; // Importation de la palette de couleurs personnalisée
import { useTheme } from '../../contexts/ThemeContext';
import axios from 'axios'; // Librairie pour effectuer des requêtes HTTP
import AsyncStorage from '@react-native-async-storage/async-storage';
const WIDTH_BTN = Dimensions.get('window').width -56;

const DeviceSettingsPage = () => {
  const [device, setDevice] = useState(null);
  const { theme } = useTheme();
  const colors = color[theme];  // Application des couleurs du thème

  const [newAlarm, setNewAlarm] = useState({ name: "", hour: "", minute: "", days: [
    { day: "Monday", isSelected: false },
    { day: "Tuesday", isSelected: false },
    { day: "Wednesday", isSelected: false },
    { day: "Thursday", isSelected: false },
    { day: "Friday", isSelected: false },
    { day: "Saturday", isSelected: false },
    { day: "Sunday", isSelected: false }
]});

  useEffect(() => {
    async function fetchDevice() {
      const device = await getUserDevice();
      setDevice(device);
      
    }
    fetchDevice();
  }, []);

  const handleDeviceChange = (name, value) => {
    setDevice({ ...device, [name]: value });
  };

  const handleSwitchChange = (name, value) => {
    setDevice({ ...device, [name]: value });
  };

  const handleAlarmChange = (name, value) => {
    setNewAlarm({ ...newAlarm, [name]: value });
  };

  const handleDayToggle = (day) => {
    setNewAlarm((prev) => {
      const days = prev.days.map((d) => d.day === day ? { ...d, isSelected: !d.isSelected } : d);
      return { ...prev, days };
    });
  };

  const saveDevice = async () => {
    try {
        const user = await getUser();
        const deviceUser = await getUserDevice();
        const raspberryIp = await AsyncStorage.getItem('raspberryIp');

        console.log("User object:", user);
        console.log("User ID:", user?.id);
        console.log("Device object:", deviceUser);
        console.log("Device ID:", deviceUser?._id);
        
        if (!user?.id) {
            throw new Error("User ID is undefined. Cannot proceed.");
        }

        let resp;
        if (deviceUser) {
            console.log("Updating device...");
            resp = await updateSubdocument(user.id, "devices", deviceUser._id, device);
        } else {
            console.log("Creating new device...");
            resp = await createSubdocument(user.id, "devices", device);
        }

        // Get the updated device
        const updatedDevice = resp.devices[0];
        await setUserDevice(updatedDevice);

        // Log the device data
        console.log("Device data to send:", JSON.stringify(updatedDevice, null, 2));

        // Validate required fields
        if (!updatedDevice?.name || updatedDevice?.isVacationModeActive === undefined) {
            throw new Error("Device name or isVacationModeActive is missing.");
        }

        // Send data to Raspberry Pi
        await axios.post(`http://${raspberryIp}:5000/device_settings`, updatedDevice, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

    } catch (error) {
        console.error("Error in saveDevice:", error.message);
    }
  };



  const addAlarm = async () => {
    if (!device) return;
    if (!device.feedingTimes) {
      device.feedingTimes = [];
    }
    const updatedDevice = { ...device, feedingTimes: [...device.feedingTimes, newAlarm] };
    setDevice(updatedDevice);
    await saveDevice();
  };

  const removeAlarm = async (index) => {
    const updatedDevice = { ...device, feedingTimes: device.feedingTimes.filter((_, i) => i !== index) };
    setDevice(updatedDevice);
    await saveDevice();
  };

  return (
    <ScrollView>
      <View className="items-center flex-1"style={{ backgroundColor: colors.background_w }}>
                    <Text className="font-bold text-3xl mb-[-20]" style={{ color: colors.orange }}>
                  mode
              </Text>
              <Text className="text-7xl text-center tracking-[4px]" style={{ fontFamily: 'cookie', color: colors.black }}>
                  vacances
              </Text>
        <Text style={{ fontSize: 20, fontWeight: "bold" , color: colors.black}}>Paramètres de l'appareil</Text>
        <TextInput className="text-xl" placeholder="Nom de l'appareil" value={device?.name || ""} onChangeText={(text) => handleDeviceChange("name", text)} />
        <TextInput className="text-xl" placeholder="Addresse MAC" value={device?.mac_adress || ""} onChangeText={(text) => handleDeviceChange("mac_adress", text)} />
        
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text className="">Mode vacances Activé     </Text>
          <Switch value={device?.isVacationModeActive || false} onValueChange={(value) => handleSwitchChange("isVacationModeActive", value)} />
        </View>
        <TextInput className="mb-[40]"placeholder="Vacation Feeding Time" keyboardType="numeric" value={String(device?.vacationFeedingTime || 2)} onChangeText={(text) => handleDeviceChange("vacationFeedingTime", text)} />
        
        <TouchableOpacity className="py-4 rounded-xl mb-[30]" style={{backgroundColor: colors.orange, width: WIDTH_BTN}}onPress={saveDevice} > <Text className="text-center"> Sauvegarder </Text> </TouchableOpacity>
        
        <Text style={{ fontSize: 20, fontWeight: "bold" , color: colors.black}}> Paramètres des alarmes</Text>
        <TextInput className="text-xl"placeholder="Nom de l'alarme" value={newAlarm.name} onChangeText={(text) => handleAlarmChange("name", text)} />
        <TextInput className="text-xl"placeholder="Heure" keyboardType="numeric" value={newAlarm.hour} onChangeText={(text) => handleAlarmChange("hour", text)} />
        <TextInput className="text-xl mb-[20]"placeholder="Minute" keyboardType="numeric" value={newAlarm.minute} onChangeText={(text) => handleAlarmChange("minute", text)} />
        
        <View className="items-center flex-1 "style={{ flexDirection: "row", flexWrap: "wrap", width: WIDTH_BTN }}>
          {newAlarm.days.map((day) => (
            <TouchableOpacity className="rounded-xl"key={day.day} onPress={() => handleDayToggle(day.day)} style={{ margin: 5, padding: 10, backgroundColor: day.isSelected ? "lightblue" : "grey" }}>
              <Text style={{ color: "white" }}>{day.day}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity className="py-4 rounded-xl mb-[30]" style={{backgroundColor: colors.orange, width: WIDTH_BTN}}onPress={addAlarm} > <Text className="text-center"> Ajouter un alarme </Text> </TouchableOpacity>


        <FlatList
          data={device?.feedingTimes || []}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View  style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
              <Text>{item.name} - {item.hour}:{item.minute} ({item.days.filter(d => d.isSelected).map(d => d.day).join(", ")})</Text>
              <Button title="Remove" onPress={() => removeAlarm(index)} />
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
};

export default DeviceSettingsPage;