import { View, Text, TouchableOpacity, Dimensions, TextInput, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { color } from '../../assets/color';
import { useTheme } from '../../contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCurrentDeepLink } from '../../utils/useDeepLink';
import { Picker } from '@react-native-picker/picker';
import { getAnimals } from '../../lib/axios'; // Assurez-vous que cette fonction est bien importée
import axios from 'axios'; // Importer axios pour la requête HTTP

const WIDTH_BTN = Dimensions.get('window').width - 56;

const Feed = () => {
    const { theme } = useTheme();
    const router = useRouter();
    const colors = color[theme];

    const [raspberryIp, setRaspberryIp] = useState("");
    const [selectedAnimal, setSelectedAnimal] = useState(""); // ID de l'animal sélectionné
    const [animals, setAnimals] = useState([]); // Liste des animaux
    const [animalData, setAnimalData] = useState(null); // Données de l'animal sélectionné (y compris number_sec_treats)

    const deepLink = useCurrentDeepLink();

    // Charger l'IP depuis AsyncStorage
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

    // Charger les animaux depuis l'API
    useEffect(() => {
        const loadAnimals = async () => {
            try {
                const animalsList = await getAnimals(); // Récupérer les animaux via votre API
                if (animalsList) {
                    setAnimals(animalsList);
                }
            } catch (error) {
                console.error('Erreur lors du chargement des animaux:', error);
            }
        };
        loadAnimals();
    }, []);

    // Mettre à jour les données de l'animal sélectionné lorsque l'ID de l'animal change
    //useEffect(() => {
    //    if (selectedAnimalId) {
    //        const selectedAnimal = animals.find(animal => animal.id === selectedAnimalId);
    //        setAnimalData(selectedAnimal);
    //    }
    //}, [selectedAnimalId, animals]);

    // Sauvegarder l'IP dans AsyncStorage
    const saveIp = async () => {
        try {
            await AsyncStorage.setItem('raspberryIp', raspberryIp);
            console.log('IP sauvegardée:', raspberryIp);
        } catch (error) {
            console.error('Erreur de sauvegarde de l\'IP:', error);
        }
    };

    // Effectuer la requête HTTP pour nourrir l'animal
    const feedAnimal = async () => {
        console.log(selectedAnimal);
        
        if (raspberryIp && selectedAnimal) {
            
            try {
                const duration = selectedAnimal.number_sec_treats; // Récupérer la durée de l'animal sélectionné
                await axios.post(`http://${raspberryIp}:5000/feed`, {
                    duration: duration,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
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
                <Text className="text-center uppercase font-bold text-3xl mb-[-20]" style={{ color: colors.orange }}>Nourrir </Text>
                <Text className="text-center font-bold text-6xl mb-[-20]" style={{ color: colors.black, fontFamily: 'cookie' }}>votre</Text>
                <Text className="text-center uppercase font-bold text-3xl mb-[20]" style={{ color: colors.orange }}> Animal </Text>

                {/* WebView pour afficher le flux vidéo */}
                <View className="h-[300] w-[300] mb-[30]" style={{ backgroundColor: colors.black }}>
                    <Text className="text-center py-[10]" style={{ color: colors.background_w }}> ₍^. .^₎⟆</Text>
                    {raspberryIp ? (
                        <WebView
                            key={raspberryIp}
                            source={{ uri: `http://${raspberryIp}:5001/video_feed` }}
                            style={{ flex: 1 }}
                        />
                    ) : (
                        <Text className="text-center" style={{ color: colors.background_w }}>
                            Entrez l'ip du Raspberry Pi pour voir la caméra
                        </Text>
                    )}
                </View>

                {/* Picker pour sélectionner un animal */}
                <Picker
                    selectedValue={selectedAnimal}
                    onValueChange={(itemValue) => setSelectedAnimal(itemValue)} // Mettre à jour l'ID de l'animal sélectionné
                    style={{
                        height: 60,
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

                {/* Bouton pour nourrir l'animal */}
                <TouchableOpacity
                    onPress={feedAnimal} // Appel à la fonction pour nourrir l'animal
                    className="rounded-xl mb-[20]"
                    style={{ backgroundColor: colors.blue, width: WIDTH_BTN }}
                >
                    <Text className="text-center text-2xl p-3 rounded-xl" style={{ backgroundColor: colors.blue, color: colors.background }}>
                        Nourrir la boule de poil
                    </Text>
                </TouchableOpacity>

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
            </View>
        </ScrollView>
    );
};

export default Feed;