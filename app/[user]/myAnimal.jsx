import { View, Text, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';  // Récupération du thème global
import { useRouter, useFocusEffect } from 'expo-router';  // Gestion de la navigation et des effets de focus
import { color } from '../../assets/color';  // Palette de couleurs basée sur le thème
import { getAnimals } from '../../lib/axios';  // Fonction pour récupérer les animaux depuis l'API
import { Font } from 'expo-font';  // Chargement des polices personnalisées
import React, { useState, useEffect, useCallback } from 'react';  // Hooks React

const MyAnimal = () => {
    const { theme } = useTheme();  // Récupération du thème actuel
    const router = useRouter();  // Gestion de la navigation
    const colors = color[theme];  // Application des couleurs du thème
    const WIDTH_BTN = Dimensions.get('window').width - 56;  // Calcul dynamique de la largeur des boutons
    const [fontLoaded, setFontLoaded] = useState(false);  // État pour savoir si la police est chargée
    const [animals, setAnimals] = useState([]);  // Stocke la liste des animaux de l'utilisateur
    const [selectedAnimal, setSelectedAnimal] = useState(null);  // Stocke l'animal actuellement sélectionné

    // Chargement de la police personnalisée au montage du composant
    useEffect(() => {
        async function loadFont() {
            await Font.loadAsync({
                'cookie': require('../../assets/font/Cookie-Regular.ttf'),
            });
            setFontLoaded(true);
        }
        loadFont();
    }, []);

    // Récupération des animaux depuis l'API
    const fetchAnimals = async () => {
        try {
            const userAnimals = await getAnimals();
            if (userAnimals) {
                setAnimals(userAnimals);
                if (userAnimals.length > 0) {
                    setSelectedAnimal(userAnimals[0]._id);  // Sélectionne le premier animal par défaut
                }
            }
        } catch (error) {
            console.error("Erreur lors du chargement des animaux :", error);
        }
    };

    // Recharger la liste des animaux lorsque l'utilisateur revient sur cet écran
    useFocusEffect(
        useCallback(() => {
            fetchAnimals();  
        }, [])
    );

    // Fonction pour afficher chaque élément de la liste d'animaux
    const renderAnimalItem = ({ item }) => (
        <TouchableOpacity
            style={{
                backgroundColor: selectedAnimal === item._id ? colors.orange : colors.card,  // Met en surbrillance l'animal sélectionné
                padding: 10,
                borderRadius: 8,
                width: '100%',
            }}
            onPress={() => {
                router.push({
                    pathname: `${item._id}/animalProfil/`,  // Redirige vers le profil de l'animal sélectionné
                    params: { id: item._id },
                });
            }}
        >
            <Text style={{ color: colors.text, fontFamily: 'cookie', fontSize: 40 }}>
                {item.name}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View className="items-center flex-1" style={{ backgroundColor: colors.background_w }}>
            {/* Titre de la page */}
            <Text className="font-bold text-3xl mb-[-20]" style={{ color: colors.orange }}>
                vos
            </Text>
            <Text className="text-7xl text-center tracking-[4px]" style={{ fontFamily: 'cookie', color: colors.black }}>
                Animaux
            </Text>

            {/* Affichage des animaux sous forme de liste */}
            {animals.length > 0 ? (
                <FlatList
                    data={animals}
                    renderItem={renderAnimalItem}
                    keyExtractor={(item) => item._id.toString()}  // Clé unique pour chaque animal
                    style={{ padding: 10, width: WIDTH_BTN }}
                />
            ) : (
                // Message si aucun animal n'est enregistré
                <Text className="justify-center" style={{ color: colors.orange }}>
                    Vous n'avez pas encore ajouté d'animal à votre liste.
                </Text>
            )}

            {/* Bouton pour ajouter un nouvel animal */}
            <TouchableOpacity>
                <Text
                    className="text-center rounded-[12] py-[12] text-2xl mb-[100]"
                    style={{ backgroundColor: colors.orange, width: WIDTH_BTN }}
                    onPress={() => router.push('./addPet')}  // Redirige vers l'ajout d'un animal
                >
                    Ajouter un animal
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default MyAnimal;
