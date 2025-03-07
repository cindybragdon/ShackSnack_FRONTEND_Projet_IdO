import { View, Image, StyleSheet, Modal, Text, KeyboardAvoidingView, Platform, ScrollView, Dimensions, TextInput, TouchableOpacity} from 'react-native';
import React, { useState, useEffect , useCallback} from 'react';
import { color } from '../../assets/color'; // Importer la palette de couleurs
import { useRouter , useFocusEffect} from 'expo-router'; // Hooks de navigation
import { useTheme } from "../../contexts/ThemeContext"; // Contexte du thème pour le style
import { getUser, setToken, updateUser, deleteUserById} from '../../lib/axios'; // Fonctions utilitaires API
import AsyncStorage from '@react-native-async-storage/async-storage'; // Pour stocker les données de façon persistante

// Définir la largeur du bouton en fonction de la taille de l'écran
const WIDTH_BTN = Dimensions.get('window').width -56;

const profil = () => {
    // Variables d'état pour stocker les données du profil utilisateur
    const [firstname, setFirstName] = useState('Default');
    const [lastname, setLastName] = useState('Default');
    const [username, setUsername] = useState("Default");
    const [email, setEmail] = useState('default@abc.ca');
    const [profilePic, setProfilePic] = useState('');
    const [isEditing, setIsEditing] = useState(false); // Pour activer/désactiver le mode édition
    const router = useRouter(); // Router pour la navigation
    const { theme } = useTheme(); // Obtenir le contexte du thème pour le style
    const colors = color[theme]; // Appliquer les couleurs du thème
    const [showModal, setShowModal] = useState(false); // État pour afficher la modal de confirmation de suppression

    // Récupérer les données du profil utilisateur quand l'écran devient actif
    useFocusEffect(
        useCallback(() => {
        const loadData = async () => {
            try {
                const profileData = await getUser(); // Récupérer les données du profil via l'API
                if (!profileData) throw new Error('Erreur lors du fetch du data -> no Data');
                setUsername(profileData.username);
                setEmail(profileData.email);
                setFirstName(profileData.firstname);
                setLastName(profileData.lastname);
                const photo = await AsyncStorage.getItem('photo'); // Récupérer la photo stockée depuis AsyncStorage
                if (photo) setProfilePic(photo); 
            } catch (error) {
                console.log('Profil: Erreur lors du loading du profile data:', error);
                router.push("/auth/signin"); // Rediriger vers la page de connexion en cas d'erreur
                console.log("Profil : Non abouti", error);
            }
        };
        loadData();
    }, []));

    // Déconnecter l'utilisateur en supprimant le token et en naviguant vers la page d'accueil
    const logOut = () => {
        setToken(''); 
        router.push('/');
    };

    // Supprimer le compte utilisateur et déconnecter l'utilisateur
    const supprimerUser = async () => {
        try {
            const profileData = await getUser();
            await deleteUserById(profileData.id); // Supprimer l'utilisateur via l'API
            logOut(); // Déconnecter l'utilisateur
        } catch (error) {
            console.log(error);
        }
    };

    // Naviguer vers la page de la caméra pour changer la photo de profil
    const handleCameraPress = () => {
        router.push("../camera");
    };

    // Sauvegarder les informations du profil utilisateur mises à jour
    const handleSaveUser = async () => {
        try {
            const profileData = await getUser();
            console.log('Profil Data:', profileData);

            // Mettre à jour les données de l'utilisateur via l'API
            await updateUser(profileData.id, username, firstname, lastname, email); 

            setIsEditing(false); // Désactiver le mode édition
            setMessageVisible(true);
            setIsEditSuccess(true); // Afficher un message de succès
            console.log('Usager modifié avec succès');
        } catch (error) {
            setIsEditSuccess(false); // Afficher un message d'erreur
            setMessageVisible(true);
            console.error('Erreur lors de la modification de l\'usager :', error);
        }
    };

    // Afficher la modal de confirmation pour la suppression du compte
    const showDeleteConfirmation = () => {
        setShowModal(true); 
    };

    // Cacher la modal de confirmation de suppression
    const hideDeleteConfirmation = () => {
        setShowModal(false); 
    };

    return (
        <ScrollView style={{backgroundColor: colors.background_w}}>
            <View className="flex-1 items-center">
                {/* Section photo de profil */}
                <View className="justify-center items-center py-5">
                    <TouchableOpacity
                        onPress={handleCameraPress} // Naviguer vers la caméra pour changer la photo de profil
                        className="rounded-full"
                        disabled={!isEditing} // Désactiver si le mode édition est désactivé
                        style={isEditing ? { borderWidth: 4, borderColor: colors.orange } : {}}
                    >
                        {profilePic !== "" ? (
                            <Image
                                className="w-[200] h-[200] rounded-full"
                                source={{ uri: profilePic }} // Afficher la photo de profil
                            />
                        ) : (
                            <View style={[styles.profileImage, { backgroundColor: colors.blue }]}>
                                <Text className="font-bold" style={{color: colors.background}}>Pas de photo</Text> {/* Texte par défaut si pas de photo */}
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Section des détails utilisateur */}
                <View className="mt-10">
                    {!isEditing ? (
                        <Text className="text-4xl font-medium uppercase" style={{ color: colors.orange }}>{username}</Text>
                    ) : (
                        <TextInput
                            className="justify-center text-center text-4xl font-medium px-16"
                            style={[{ color: color.blue, backgroundColor: colors.background }]}
                            value={username}
                            onChangeText={(item) => { setUsername(item); }}
                            placeholder={'Nom d\'utilisateur'}
                            placeholderTextColor={colors.blue}
                        />
                    )}
                </View>

                {/* Affichage et champs éditables */}
                <View className="items-center mb-[20]">
                    {/* Prénom */}
                    {!isEditing ? (
                        <Text className="" style={{ color: colors.black }}> Prénom : {firstname}</Text>
                    ) : (
                        <TextInput
                            className="justify-center text-center text-4xl font-medium px-16"
                            style={[{ color: color.blue, backgroundColor: colors.background }]}
                            value={firstname}
                            onChangeText={(item) => { setFirstName(item); }}
                            placeholder={'Prénom'}
                            placeholderTextColor={colors.blue}
                        />
                    )}

                    {/* Nom */}
                    {!isEditing ? (
                        <Text className="" style={{ color: colors.black }}> Nom : {lastname}</Text>
                    ) : (
                        <TextInput
                            className="justify-center text-center text-4xl font-medium px-16"
                            style={[{ color: color.blue, backgroundColor: colors.background }]}
                            value={lastname}
                            onChangeText={(item) => { setLastName(item); }}
                            placeholder={'Nom'}
                            placeholderTextColor={colors.blue}
                        />
                    )}

                    {/* Email */}
                    {!isEditing ? (
                        <Text className="" style={{ color: colors.black }}> Courriel : {email}</Text>
                    ) : (
                        <TextInput
                            className="justify-center text-center text-4xl font-medium px-16"
                            style={[{ color: color.blue, backgroundColor: colors.background }]}
                            value={email}
                            onChangeText={(item) => { setEmail(item); }}
                            placeholder={'Courriel'}
                            placeholderTextColor={colors.blue}
                        />
                    )}
                </View>

                {/* Boutons d'action */}
                <View className="mb-[50]" style={{ padding: 20 }}>
                    <View style={{ flexDirection: '', justifyContent: 'space-between', marginBottom: 10 }}>
                        <TouchableOpacity className={"py-2 pb-4 px-8 "} style={[{width: WIDTH_BTN}]} onPress={() => setIsEditing(!isEditing)}>
                            <Text className="text-center font-xl text-2xl p-3 rounded-xl " style={[{backgroundColor: colors.blue, color: colors.background}] }> Modifier vos info</Text>
                        </TouchableOpacity>
                        {isEditing && (
                            <TouchableOpacity className={"py-2 pb-4 px-8 "} onPress={handleSaveUser} style={[{  width: WIDTH_BTN}]}>
                                <Text className="text-center font-xl text-2xl p-3 rounded-xl " style={{ color: colors.background_w , backgroundColor: colors.orange}}>Sauvegarder</Text>
                            </TouchableOpacity>
                        )}
                        {/* Autres actions */}
                        <TouchableOpacity className={"py-2 pb-4 px-8"} style={[{width: WIDTH_BTN}]} onPress={() => { router.push("./addPet") }}>
                            <Text className="text-center font-xl text-2xl p-3 rounded-xl " style={[{backgroundColor: colors.blue, color: colors.background}] }> Ajouter un animal</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className={"py-2 pb-4 px-8"} style={[{width: WIDTH_BTN}]} onPress={() => { router.push("./myAnimal") }}>
                            <Text className="text-center font-xl text-2xl p-3 rounded-xl " style={[{backgroundColor: colors.blue, color: colors.background}] }> Mes animaux</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className={"py-2 pb-4 px-8"} style={[{width: WIDTH_BTN}]} onPress={showDeleteConfirmation}>
                            <Text className="text-center font-xl text-2xl p-3 rounded-xl " style={[{backgroundColor: colors.blue, color: colors.background}] }> Supprimer votre compte</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className={"py-2 pb-4 px-8"} style={[{width: WIDTH_BTN}]} onPress={logOut}>
                            <Text className="text-center font-xl text-2xl p-3 rounded-xl " style={[{backgroundColor: colors.blue, color: colors.background}] }> Déconnexion</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Modal de confirmation de suppression */}
                <Modal
                    visible={showModal}
                    animationType="fade"
                    transparent={true}
                    onRequestClose={hideDeleteConfirmation}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <Text className="text-xl"style={{ color: colors.black}}>Êtes-vous sûr de vouloir supprimer votre compte ?</Text>
                            <View style={styles.modalButtons}>
                                <TouchableOpacity className="py-[10] w-[120] rounded-xl"onPress={supprimerUser} style={{backgroundColor: colors.orange}}>
                                    <Text className="text-center"style={{color : colors.background_w}}>Oui</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="py-[10] w-[120] rounded-xl" onPress={hideDeleteConfirmation} style={{backgroundColor: colors.orange}}>
                                    <Text  className="text-center"style={{color : colors.background_w}}>Non</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

            </View>
        </ScrollView>
    );
};

// Styles pour l'image de profil et la modal
const styles = StyleSheet.create({
    profileImage: {
        width: 200, 
        height: 200, 
        borderRadius: 100, 
        justifyContent: 'center',
        alignItems: 'center',
    },
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

export default profil;
