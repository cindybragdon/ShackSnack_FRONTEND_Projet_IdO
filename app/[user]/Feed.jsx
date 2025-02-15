import { View, Text, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { color } from '../../assets/color';
import { useTheme } from '../../contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';  // Import AsyncStorage

const WIDTH_BTN = Dimensions.get('window').width - 56;

const Feed = () => {
    const { theme } = useTheme();
    const router = useRouter();
    const colors = color[theme];

    const [raspberryIp, setRaspberryIp] = useState("");

    // Charger l'IP depuis AsyncStorage au premier rendu
    useEffect(() => {
        const loadIp = async () => {
            try {
                const savedIp = await AsyncStorage.getItem('raspberryIp');
                if (savedIp) {
                    setRaspberryIp(savedIp); // Mettre à jour l'état avec l'IP chargée
                }
            } catch (error) {
                console.error('Erreur de chargement de l\'IP:', error);
            }
        };
        loadIp();
    }, []);

    // Sauvegarder l'IP dans AsyncStorage
    const saveIp = async () => {
        try {
            await AsyncStorage.setItem('raspberryIp', raspberryIp);
            console.log('IP sauvegardée:', raspberryIp);
        } catch (error) {
            console.error('Erreur de sauvegarde de l\'IP:', error);
        }
    };

    useEffect(() => {
        console.log("Raspberry IP mise à jour:", raspberryIp);
    }, [raspberryIp]);

    return (
        <View className="flex-1 items-center" style={{ backgroundColor: colors.background_w }}>
            <Text className="text-center uppercase font-bold text-3xl mb-[-20]" style={{ color: colors.orange }}>Feed </Text>
            <Text className="text-center font-bold text-6xl mb-[-20]" style={{ color: colors.black, fontFamily: 'cookie' }}>your</Text>
            <Text className="text-center uppercase font-bold text-3xl mb-[20]" style={{ color: colors.orange }}> Animal </Text>

            {/* Champ pour entrer l'IP */}
            <TextInput
                style={{
                    height: 40,
                    borderColor: 'gray',
                    borderWidth: 1,
                    width: WIDTH_BTN,
                    marginBottom: 20,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    backgroundColor: colors.background_w,
                    color: colors.black,
                }}
                placeholder="Entrez l'IP du Raspberry Pi"
                placeholderTextColor="gray"
                value={raspberryIp}
                onChangeText={setRaspberryIp}
            />

            {/* WebView qui affiche le flux vidéo */}
            <View className="h-[300] w-[300] mb-[30]" style={{ backgroundColor: colors.black }}>
                <Text className="text-center py-[10]" style={{ color: colors.background_w }}> ₍^. .^₎⟆</Text>
                {raspberryIp ? (
                    console.log(`Chargement de : http://${raspberryIp}:5001/video_feed`),
                    <WebView
                        key={raspberryIp}  // Forcer le rechargement du WebView à chaque changement d'IP
                        source={{ uri: `http://${raspberryIp}:5001/video_feed` }}
                        style={{ flex: 1 }}
                    />
                ) : (
                    <Text className="text-center" style={{ color: colors.background_w }}>
                        Entrez une IP pour voir la caméra
                    </Text>
                )}
            </View>

            {/* Bouton pour sauvegarder l'IP */}
            <TouchableOpacity
                onPress={saveIp}
                className="rounded-xl mb-[20]"
                style={{ backgroundColor: colors.blue, width: WIDTH_BTN }}
            >
                <Text className="text-center text-2xl p-3 rounded-xl" style={{ backgroundColor: colors.blue, color: colors.background }}>
                    Sauvegarder l'IP
                </Text>
            </TouchableOpacity>

            <TouchableOpacity className="rounded-xl mb-[20]" style={{ backgroundColor: colors.blue, width: WIDTH_BTN }}>
                <Text className="text-center text-2xl p-3 rounded-xl" style={{ backgroundColor: colors.blue, color: colors.background }}>Feed?</Text>
            </TouchableOpacity>

            <TouchableOpacity className="rounded-xl mb-[20]" style={{ backgroundColor: colors.blue, width: WIDTH_BTN }}>
                <Text className="text-center text-2xl p-3 rounded-xl" style={{ backgroundColor: colors.blue, color: colors.background }}>No feed D: </Text>
            </TouchableOpacity>

            <Text>Liste animal drop down</Text>
        </View>
    );
};

export default Feed;
