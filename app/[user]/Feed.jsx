import { View, Text, TouchableOpacity, Dimensions, TextInput, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { color } from '../../assets/color';
import { useTheme } from '../../contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCurrentDeepLink } from '../../utils/useDeepLink';
import { Picker } from '@react-native-picker/picker';
import { createFeedingLog, getUser, getUserDevice } from '../../lib/axios';
import { getAnimals } from '../../lib/axios'; // Fonction pour récupérer la liste des animaux depuis l'API
import axios from 'axios'; // Librairie pour effectuer des requêtes HTTP

// Définition de la largeur des boutons pour s'adapter à l'écran
const WIDTH_BTN = Dimensions.get('window').width - 56;

const Feed = () => {
    const { theme } = useTheme();
    const router = useRouter();
    const colors = color[theme];

    // États pour stocker l'IP du Raspberry Pi, l'animal sélectionné et la liste des animaux
    const [raspberryIp, setRaspberryIp] = useState("");
    const [selectedAnimal, setSelectedAnimal] = useState(""); // Contient l'ID de l'animal sélectionné
    const [animals, setAnimals] = useState([]); // Liste des animaux disponibles
    const [animalData, setAnimalData] = useState(null); // Données détaillées de l'animal sélectionné

    const deepLink = useCurrentDeepLink();

    // Chargement de l'IP stockée dans AsyncStorage au démarrage de l'application
    useEffect(() => {
        const loadIp = async () => {
            try {
                const savedIp = await AsyncStorage.getItem('raspberryIp');
                if (savedIp) {
                    setRaspberryIp(savedIp);
                }
            } catch (error) {
                console.error('Erreur de chargement de l\'IP:', error);
            }
        };
        loadIp();
    }, []);

    // Chargement de la liste des animaux depuis l'API
    useEffect(() => {
        const loadAnimals = async () => {
            try {
                const animalsList = await getAnimals();
                if (animalsList) {
                    setAnimals(animalsList);
                }
            } catch (error) {
                console.error('Erreur lors du chargement des animaux:', error);
            }
        };
        loadAnimals();
    }, []);

    // Sauvegarde de l'IP du Raspberry Pi dans AsyncStorage
    const saveIp = async () => {
        try {
            await AsyncStorage.setItem('raspberryIp', raspberryIp);
            console.log('IP sauvegardée:', raspberryIp);
        } catch (error) {
            console.error('Erreur de sauvegarde de l\'IP:', error);
        }
    };

    // Fonction pour envoyer une requête HTTP et nourrir l'animal sélectionné
    const feedAnimal = async () => {
        console.log(selectedAnimal);
        
        // Vérifie si l'IP du Raspberry Pi et un animal ont bien été sélectionnés
        if (raspberryIp && selectedAnimal) {
            try {
                const duration = selectedAnimal.number_sec_treats; // Récupération de la durée de distribution des friandises
                await axios.post(`http://${raspberryIp}:5000/feed`, {
                    duration: duration,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const user = await getUser()
                const device = await getUserDevice()
                if(device) {
                    console.log(device)
                    console.log(selectedAnimal)
                    console.log(selectedAnimal._id)
                    console.log(device._id)
                    await createFeedingLog(selectedAnimal._id, device._id, "Dry Food", duration);
                }
                console.log(`L'animal ${selectedAnimal.name} est nourri durant ${duration} secondes.`);
            } catch (error) {
                console.error('Erreur lors de l\'envoi de la requête pour nourrir l\'animal:', error);
            }
        } else {
            console.error('IP ou animal non sélectionné.');
        }
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ backgroundColor: colors.background_w }}>
            <View className="items-center">
                {/* Titre de la page */}
                <Text className="text-center uppercase font-bold text-3xl mb-[-20]" style={{ color: colors.orange }}>Nourrir </Text>
                <Text className="text-center font-bold text-6xl mb-[-20]" style={{ color: colors.black, fontFamily: 'cookie' }}>votre</Text>
                <Text className="text-center uppercase font-bold text-3xl mb-[20]" style={{ color: colors.orange }}> Animal </Text>

                {/* Affichage du flux vidéo du Raspberry Pi via WebView */}
                <View className="h-[300] w-[300] mb-[30]" style={{ backgroundColor: colors.black }}>
                    <Text className="text-center py-[10]" style={{ color: colors.background_w }}> ₍^. .^₎⟆</Text>
                    {raspberryIp ? (
                        <WebView
                            key={raspberryIp} // Force le rechargement du WebView si l'IP change
                            source={{ uri: `http://${raspberryIp}:5001/video_feed` }}
                            style={{ flex: 1 }}
                        />
                    ) : (
                        <Text className="text-center" style={{ color: colors.background_w }}>
                            Entrez l'IP du Raspberry Pi pour voir la caméra
                        </Text>
                    )}
                </View>

                {/* Sélection d'un animal via un Picker */}
                <Picker
                    selectedValue={selectedAnimal}
                    onValueChange={(itemValue) => setSelectedAnimal(itemValue)}
                    style={{
                        width: WIDTH_BTN,
                        backgroundColor: colors.background_w,
                        color: colors.black,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: 'gray',
                        marginBottom: 20
                    }}
                >
                    <Picker.Item label="Sélectionnez un animal" value="" />
                    {animals && animals.map((animal, index) => (
                        <Picker.Item key={index} label={animal.name} value={animal} />
                    ))}
                </Picker>

                {/* Bouton pour nourrir l'animal sélectionné */}
                <TouchableOpacity
                    onPress={feedAnimal}
                    className="rounded-xl mb-[20]"
                    style={{ backgroundColor: colors.blue, width: WIDTH_BTN }}
                >
                    <Text className="text-center text-2xl p-3 rounded-xl" style={{ backgroundColor: colors.blue, color: colors.background }}>
                        Nourrir la boule de poil
                    </Text>
                </TouchableOpacity>

                {/* Champ de saisie pour l'IP du Raspberry Pi */}
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

                {/* Bouton pour sauvegarder l'IP du Raspberry Pi */}
                <TouchableOpacity
                    onPress={saveIp}
                    className="rounded-xl mb-[20]"
                    style={{ backgroundColor: colors.blue, width: WIDTH_BTN }}
                >
                    <Text className="text-center text-2xl p-3 rounded-xl" style={{ backgroundColor: colors.blue, color: colors.background }}>
                        Sauvegarder l'IP
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default Feed;
