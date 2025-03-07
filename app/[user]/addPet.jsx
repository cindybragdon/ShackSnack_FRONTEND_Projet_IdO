// Importation des composants React Native nécessaires pour la mise en page et l'interaction utilisateur
import { 
    View, Text, KeyboardAvoidingView, Platform, Dimensions, TextInput, 
    TouchableOpacity, Modal, StyleSheet 
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { color } from '../../assets/color';
import { useTheme } from '../../contexts/ThemeContext';
import DateTimePicker from '@react-native-community/datetimepicker';

// Importation des fonctions pour la gestion des utilisateurs et des animaux via Axios
import { createSubdocument, getUser, setAnimals } from '../../lib/axios';

// Définition de la largeur des boutons en fonction de la taille de l'écran
const WIDTH_BTN = Dimensions.get('window').width - 56;

const addPet = () => {
    // Récupération du thème actuel depuis le contexte
    const { theme } = useTheme();
    const router = useRouter(); // Gestion de la navigation
    const colors = color[theme]; // Définition des couleurs selon le thème

    // État du formulaire pour stocker les informations de l'animal
    const [form, setForm] = useState({
        name: '', nickname: '', type: '', weight: '', birthdate: '', treats: '', meal: ''
    });

    // États pour afficher ou masquer le DateTimePicker et la modal de confirmation
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Gestion de la sélection d'une date de naissance
    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || form.birthdate;
        setShowDatePicker(false);
        setForm({ ...form, birthdate: currentDate });
    };

    // Affichage de la modale de confirmation
    const showDeleteConfirmation = () => {
        setShowModal(true);
    };
      
    // Fermeture de la modale de confirmation
    const hideDeleteConfirmation = () => {
        setShowModal(false);
    };

    // Fonction pour ajouter un animal dans la base de données
    const handleAddAnimal = async () => {
        const currentUser = await getUser(); // Récupération des informations de l'utilisateur connecté
        console.log('Animal ajouté :', form); // Log pour vérifier les données envoyées

        try {
            // Création de l'objet de l'animal à enregistrer
            const data = {
                name: form.name,
                nickname: form.nickname,
                type_animal: form.type,
                weight: form.weight,
                birth_date: form.birthdate,
                number_sec_treats: form.treats,
                number_sec_food: form.meal
            };

            // Envoi des données au backend
            const resp = await createSubdocument(currentUser.id, 'animals', data);
            
            // Mise à jour des animaux stockés localement
            await setAnimals(resp.animals);
            
            setShowModal(false); // Fermeture de la modale
            router.push('[user]/myAnimal'); // Redirection vers la liste des animaux
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'animal:", error);
            alert("Une erreur est survenue, veuillez réessayer.");
        }
    };

    return (
        <KeyboardAvoidingView
            keyboardVerticalOffset={0}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[{ backgroundColor: colors.background_w }]}
            className="flex-1"
        >
            <View className="flex-1" style={{ backgroundColor: colors.background_w }}>
                {/* Titre de la page */}
                <Text className="text-center uppercase font-bold text-3xl" style={{ color: colors.orange }}>
                    Ajoutez
                </Text>
                <Text className="text-center font-bold text-6xl" style={{ color: colors.black, fontFamily: 'cookie' }}>
                    vos
                </Text>
                <Text className="text-center uppercase font-bold text-3xl mb-[100]" style={{ color: colors.orange }}>
                    Animaux
                </Text>

                {/* Formulaire pour entrer les informations de l'animal */}
                <View className="justify-center items-center">
                    <TextInput
                        style={{ backgroundColor: colors.blue, width: WIDTH_BTN }}
                        onChangeText={(item) => setForm({ ...form, name: item })}
                        placeholder="Entrez le nom de votre animal"
                        placeholderTextColor={colors.background_w}
                        value={form.name}
                        className="py-4 rounded text-center mb-[10]"
                    />
                    <TextInput
                        style={{ backgroundColor: colors.blue, width: WIDTH_BTN }}
                        onChangeText={(item) => setForm({ ...form, nickname: item })}
                        placeholder="Entrez le surnom de votre animal"
                        placeholderTextColor={colors.background_w}
                        value={form.nickname}
                        className="py-4 rounded text-center mb-[10]"
                    />
                    <TextInput
                        style={{ backgroundColor: colors.blue, width: WIDTH_BTN }}
                        onChangeText={(item) => setForm({ ...form, type: item })}
                        placeholder="Entrez le type d'animal"
                        placeholderTextColor={colors.background_w}
                        value={form.type}
                        className="py-4 rounded text-center mb-[10]"
                    />
                    <TextInput
                        style={{ backgroundColor: colors.blue, width: WIDTH_BTN }}
                        onChangeText={(item) => setForm({ ...form, weight: item })}
                        placeholder="Entrez le poids de votre animal"
                        placeholderTextColor={colors.background_w}
                        value={form.weight}
                        keyboardType='numeric'
                        className="py-4 rounded text-center mb-[10]"
                    />

                    {/* Sélection de la date de naissance */}
                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        style={{ backgroundColor: colors.blue, width: WIDTH_BTN, padding: 15, borderRadius: 10, marginBottom: 10 }}
                    >
                        <Text style={{ color: colors.background_w, textAlign: 'center' }}>
                            {form.birthdate ? form.birthdate.toLocaleDateString() : 'Sélectionnez la date de naissance'}
                        </Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={form.birthdate || new Date()}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                        />
                    )}

                    {/* Champs pour les durées de repas et gâteries */}
                    <TextInput
                        style={{ backgroundColor: colors.blue, width: WIDTH_BTN }}
                        onChangeText={(item) => setForm({ ...form, treats: item })}
                        placeholder="Gâteries (secondes) *"
                        placeholderTextColor={colors.background_w}
                        value={form.treats}
                        keyboardType='numeric'
                        className="py-4 rounded text-center mb-[10]"
                    />
                    <TextInput
                        style={{ backgroundColor: colors.blue, width: WIDTH_BTN }}
                        onChangeText={(item) => setForm({ ...form, meal: item })}
                        placeholder="Repas (secondes) *"
                        placeholderTextColor={colors.background_w}
                        value={form.meal}
                        keyboardType='numeric'
                        className="py-4 rounded text-center mb-[10]"
                    />

                    {/* Bouton pour ajouter l'animal */}
                    <TouchableOpacity className={"py-2 pb-4 px-8"} style={[{ width: WIDTH_BTN }]} onPress={showDeleteConfirmation}>
                        <Text className="text-center font-xl text-2xl p-3 rounded-xl" style={[{ backgroundColor: colors.orange, color: colors.background }]}>
                            Ajouter l'animal
                        </Text>
                    </TouchableOpacity>

                    {/* Modal de confirmation */}
                    <Modal
                        visible={showModal}
                        animationType="fade"
                        transparent={true}
                        onRequestClose={hideDeleteConfirmation}
                    >
                        <View style={styles.modalBackground}>
                            <View style={styles.modalContainer}>
                                <Text className="text-xl" style={{ color: colors.black }}>Ajouter l'animal</Text>
                                <View style={styles.modalButtons}>
                                    <TouchableOpacity onPress={handleAddAnimal} style={{ backgroundColor: colors.orange }}>
                                        <Text style={{ color: colors.background_w }}>Oui</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={hideDeleteConfirmation} style={{ backgroundColor: colors.orange }}>
                                        <Text style={{ color: colors.background_w }}>Non</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({

    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: 300,
        alignItems: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        width: '100%',
    },
});

export default addPet;
