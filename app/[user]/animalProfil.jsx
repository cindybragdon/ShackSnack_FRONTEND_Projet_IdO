import { View, Text, TouchableOpacity, Dimensions, TextInput, Image, StyleSheet, Modal } from 'react-native';
import React, { useState, useCallback } from 'react';
import { color } from '../../assets/color';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useTheme } from "../../contexts/ThemeContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUser, getAnimals, getSubdocumentById, updateSubdocument, setAnimals, deleteSubdocument } from '../../lib/axios';

const WIDTH_BTN = Dimensions.get('window').width - 56; // Définit la largeur des boutons en fonction de la taille de l'écran

const animalProfil = () => {
    const router = useRouter();
    const { theme } = useTheme();
    const colors = color[theme]; // Récupération des couleurs selon le thème

    // États pour stocker les informations de l'animal
    const [animalPic, setAnimalPic] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [type_animal, setType] = useState('');
    const [weight, setWeight] = useState('');
    const [birth_date, setBirthDate] = useState('');
    const [number_sec_treats, setTreats] = useState('');
    const [number_sec_food, setMeal] = useState('');
    const [userId, setUserId] = useState(null);
    const [animalId, setAnimalId] = useState(null);
    const params = useLocalSearchParams(); // Récupère les paramètres de navigation
    const [showModal, setShowModal] = useState(false); // Gère l'affichage du modal de confirmation

    // Fonction pour ouvrir la caméra pour prendre une photo
    const handleCameraPress = () => {
        router.push("../camera1");
    };

    // Fonction pour mettre à jour les informations de l'animal
    const updateAnimal = async () => {
        try {
            await AsyncStorage.setItem('photoAnimal', animalPic);
            const userData = await getUser();
            const animalData = { name, nickname, type_animal, weight, birth_date, number_sec_treats, number_sec_food };

            const resp = await updateSubdocument(userData.id, 'animals', id, animalData);
            await setAnimals(resp.animals); // Mise à jour de la liste des animaux

            console.log("Photo et informations sauvegardées avec succès !");
            setIsEditing(false); // Désactive le mode édition
        } catch (error) {
            console.log("Échec de la sauvegarde des informations", error);
        }
    };

    const { id = '' } = params; // Récupération de l'ID de l'animal depuis les paramètres

    // Fonction pour récupérer les détails de l'utilisateur et de l'animal
    const fetchUserAndAnimalDetails = async () => {
        setAnimalPic('');
        setName('');
        setNickname('');
        setType('');
        setWeight('');
        setBirthDate('');
        setTreats('');
        setMeal('');

        try {
            const userData = await getUser();
            const userAnimals = await getAnimals();

            if (userData && userAnimals && userAnimals.length > 0) {
                setUserId(userData.id);

                // Récupération des détails de l'animal spécifique
                const animalDetails = await getSubdocumentById(userData.id, 'animals', id);
                const photo1 = await AsyncStorage.getItem('photoAnimal');

                if (animalDetails) {
                    if (photo1) setAnimalPic(photo1);

                    setName(animalDetails.name || '');
                    setNickname(animalDetails.nickname || '');
                    setType(animalDetails.type_animal || '');
                    setWeight(animalDetails.weight || '');
                    setBirthDate(animalDetails.birth_date || '');
                    setTreats(animalDetails.number_sec_treats || '');
                    setMeal(animalDetails.number_sec_food || '');
                }
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des informations :", error);
        }
    };

    // Chargement des données à chaque focus sur l'écran
    useFocusEffect(
        useCallback(() => {
            fetchUserAndAnimalDetails();
        }, [id])
    );

    // Fonction pour supprimer un animal
    const supprimerAnimal = async () => {
        try {
            const userData = await getUser();
            await deleteSubdocument(userData.id, 'animals', id);

            // Mise à jour de la liste des animaux après suppression
            const animals = await getAnimals();
            const updatedAnimalList = animals.filter(animal => animal._id !== id);
            await setAnimals(updatedAnimalList);

            hideDeleteConfirmation();
            router.push('./myAnimal'); // Redirection vers la liste des animaux
        } catch (error) {
            console.log("Erreur lors de la suppression :", error);
        }
    };

    // Afficher le modal de confirmation de suppression
    const showDeleteConfirmation = () => {
        setShowModal(true);
    };

    // Cacher le modal de confirmation
    const hideDeleteConfirmation = () => {
        setShowModal(false);
    };

    return (
        <View className="flex-1" style={{ backgroundColor: colors.background_w }}>
            <View className="p-12 items-center">
                {/* Affichage de la photo de l'animal */}
                <TouchableOpacity onPress={handleCameraPress} className="rounded-full" disabled={!isEditing} style={isEditing ? { borderWidth: 4, borderColor: colors.blue } : {}}>
                    {animalPic !== "" ? (
                        <Image className="w-[200] h-[200] rounded-full" source={{ uri: animalPic }} />
                    ) : (
                        <View className="w-[200] h-[200] rounded-full bg-gray-400 justify-center items-center" style={{ backgroundColor: colors.orange }}>
                            <Text className="text-white font-bold">Pas de photo</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Champs d'édition des informations de l'animal */}
                <Text className="text-4xl font-medium uppercase mt-[30]" style={{ color: colors.orange }}>{name}</Text>

                {/* Bouton pour activer l'édition */}
                <TouchableOpacity className={"py-2 pb-4 px-8 mt-[100] "} style={[{ width: WIDTH_BTN }]} onPress={() => setIsEditing(!isEditing)}>
                    <Text className="text-center font-xl text-2xl p-3 rounded-xl" style={[{ backgroundColor: colors.blue, color: colors.background }]}>Modifier vos infos</Text>
                </TouchableOpacity>

                {/* Bouton de sauvegarde après édition */}
                {isEditing && (
                    <TouchableOpacity className={"py-2 pb-4 px-8 "} onPress={updateAnimal} style={[{ width: WIDTH_BTN }]}>
                        <Text className="text-center font-xl text-2xl p-3 rounded-xl" style={{ color: colors.background_w, backgroundColor: colors.orange }}>Enregistrer</Text>
                    </TouchableOpacity>
                )}

                {/* Bouton de suppression */}
                <TouchableOpacity className={"py-2 pb-4 px-8"} style={[{ width: WIDTH_BTN }]} onPress={showDeleteConfirmation}>
                    <Text className="text-center font-xl text-2xl p-3 rounded-xl " style={[{ backgroundColor: colors.blue, color: colors.background }]}>Supprimer l'animal</Text>
                </TouchableOpacity>
            </View>

            {/* Modal de confirmation de suppression */}
            <Modal visible={showModal} animationType="fade" transparent={true} onRequestClose={hideDeleteConfirmation}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text className="text-xl" style={{ color: colors.black }}>Êtes-vous sûr de vouloir supprimer cet animal ?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity className="py-[10] w-[120] rounded-xl" onPress={supprimerAnimal} style={{ backgroundColor: colors.orange }}>
                                <Text className="text-center" style={{ color: colors.background_w }}>Oui</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="py-[10] w-[120] rounded-xl" onPress={hideDeleteConfirmation} style={{ backgroundColor: colors.orange }}>
                                <Text className="text-center" style={{ color: colors.background_w }}>Non</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default animalProfil;
