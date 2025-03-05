import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Switch, Button, FlatList, TouchableOpacity } from "react-native";
import { getUser, updateSubdocument, createSubdocument } from "../../lib/axios";

const DeviceSettingsPage = () => {
  const [device, setDevice] = useState(null);
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
      const user = await getUser();
      if (user?.devices?.length > 0) {
        setDevice(user.devices[0]);
      }
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
    const user = await getUser();
    if (device._id) {
      await updateSubdocument(user.id, "devices", device._id, device);
    } else {
      await createSubdocument(user.id, "devices", device);
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
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Device Settings</Text>
      <TextInput placeholder="Device Name" value={device?.name || ""} onChangeText={(text) => handleDeviceChange("name", text)} />
      <TextInput placeholder="MAC Address" value={device?.mac_adress || ""} onChangeText={(text) => handleDeviceChange("mac_adress", text)} />
      
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text>Vacation Mode Active</Text>
        <Switch value={device?.isVacationModeActive || false} onValueChange={(value) => handleSwitchChange("isVacationModeActive", value)} />
      </View>
      <TextInput placeholder="Vacation Feeding Time" keyboardType="numeric" value={String(device?.vacationFeedingTime || 2)} onChangeText={(text) => handleDeviceChange("vacationFeedingTime", text)} />
      
      <Button title="Save Device" onPress={saveDevice} />
      
      <Text style={{ fontSize: 18, marginTop: 20 }}>Alarms</Text>
      <TextInput placeholder="Alarm Name" value={newAlarm.name} onChangeText={(text) => handleAlarmChange("name", text)} />
      <TextInput placeholder="Hour" keyboardType="numeric" value={newAlarm.hour} onChangeText={(text) => handleAlarmChange("hour", text)} />
      <TextInput placeholder="Minute" keyboardType="numeric" value={newAlarm.minute} onChangeText={(text) => handleAlarmChange("minute", text)} />
      
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {newAlarm.days.map((day) => (
          <TouchableOpacity key={day.day} onPress={() => handleDayToggle(day.day)} style={{ margin: 5, padding: 10, backgroundColor: day.isSelected ? "blue" : "grey" }}>
            <Text style={{ color: "white" }}>{day.day}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Button title="Add Alarm" onPress={addAlarm} />

      <FlatList
        data={device?.feedingTimes || []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
            <Text>{item.name} - {item.hour}:{item.minute} ({item.days.filter(d => d.isSelected).map(d => d.day).join(", ")})</Text>
            <Button title="Remove" onPress={() => removeAlarm(index)} />
          </View>
        )}
      />
    </View>
  );
};

export default DeviceSettingsPage;