import { View, Text, KeyboardAvoidingView, Platform, Dimensions, TextInput, TouchableOpacity, Image, StyleSheet , Modal} from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { color } from '../../assets/color'
import { useTheme } from '../../contexts/ThemeContext'
import DateTimePicker from '@react-native-community/datetimepicker';
import { createSubdocument, getUser, setAnimals } from '../../lib/axios'

const WIDTH_BTN = Dimensions.get('window').width - 56;

const addPet = () => {

    const { theme } = useTheme();
    const router = useRouter();
    const colors = color[theme]
    const [fontLoaded, setFontLoaded] = useState(false);
    const [form, setForm] = useState({ name: '', nickname: '', type: '', weight: '', birthdate: '', treats: '', meal: '' });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showModal, setShowModal] = useState(false); 


    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || form.birthdate;
        setShowDatePicker(false);
        setForm({ ...form, birthdate: currentDate });
    };

    const showDeleteConfirmation = () => {
        setShowModal(true); 
      };
      
      const hideDeleteConfirmation = () => {
        setShowModal(false); 
      };

      const handleAddAnimal = async () => {
      
    
    
        const currentUser = await getUser();
        console.log('Animal ajouté :', form);
    
        try {
            const data = {
                name: form.name,
                nickname: form.nickname,
                type_animal: form.type,
                weight: form.weight,
                birth_date: form.birthdate,
                number_sec_treats: form.treats,
                number_sec_food: form.meal
            };
            const resp = await createSubdocument(currentUser.id, 'animals', data);
            
            await setAnimals(resp.animals)
            setShowModal(false);
            
            router.push('[user]/myAnimal');
        } catch (error) {
            console.error("Error adding animal:", error);
            alert("Une erreur est survenue, veuillez réessayer.");
        }
    };
    


    useEffect(() => {
        async function loadFont() {
            await Font.loadAsync({
                'cookie': require('../../assets/font/Cookie-Regular.ttf'),
            });
            setFontLoaded(true);
        }

        loadFont();
    }, []);

    return (
        <KeyboardAvoidingView
            keyboardVerticalOffset={0}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[{ backgroundColor: colors.background_w }]}
            className="flex-1">
            <View className="flex-1" style={{ backgroundColor: colors.background_w }}>

                <Text className="text-center uppercase font-bold text-3xl mb-[-20]" style={{ color: colors.orange }}> Ajouter </Text>
                <Text className="text-center  font-bold text-6xl mb-[-20]" style={{ color: colors.black, fontFamily: 'cookie' }}>vos</Text>
                <Text className="text-center uppercase font-bold text-3xl mb-[100]" style={{ color: colors.orange }}> Animaux</Text>
                <View className="justify-center items-center">
                    <TextInput
                        style={{ backgroundColor: colors.blue, width: WIDTH_BTN }}
                        onChangeText={(item) => setForm({ ...form, name: item })}
                        placeholder={"Entrez le nom de votre animal"}
                        placeholderTextColor={colors.background_w}
                        value={form.name}
                        className="py-4 rounded text-center mb-[10]"
                    />
                    <TextInput
                        style={{ backgroundColor: colors.blue, width: WIDTH_BTN }}
                        onChangeText={(item) => setForm({ ...form, nickname: item })}
                        placeholder={"Entrez le surnom de votre animal"}
                        placeholderTextColor={colors.background_w}
                        value={form.nickname}
                        className="py-4 rounded text-center mb-[10]"
                    />
                        <TextInput
                        style={{ backgroundColor: colors.blue, width: WIDTH_BTN }}
                        onChangeText={(item) => setForm({ ...form, type: item })}
                        placeholder={"Entrez le type d'animal "}
                        placeholderTextColor={colors.background_w}
                        value={form.type}
                        className="py-4 rounded text-center mb-[10]"
                    />
                     <TextInput
                        style={{ backgroundColor: colors.blue, width: WIDTH_BTN }}
                        onChangeText={(item) => setForm({ ...form, weight: item })}
                        placeholder={"Entrez le poids de votre animal "}
                        placeholderTextColor={colors.background_w}
                        value={form.weight}
                        keyboardType='numeric'
                        className="py-4 rounded text-center mb-[10]"
                    />


                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        style={{ backgroundColor: colors.blue, width: WIDTH_BTN, padding: 15, borderRadius: 10, marginBottom: 10 }}>
                        <Text style={{ color: colors.background_w, textAlign: 'center' }}>
                            {form.birthdate ? form.birthdate.toLocaleDateString() : 'Sélectionner la date de naissance'}
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
                    <TextInput
                        style={{ backgroundColor: colors.blue, width: WIDTH_BTN }}
                        onChangeText={(item) => setForm({ ...form, treats: item })}
                        placeholder={"Gâteries (secondes) * "}
                        placeholderTextColor={colors.background_w}
                        value={form.treats}
                        keyboardType='numeric'
                        className="py-4 rounded text-center mb-[10]"
                    />
                    <TextInput
                        style={{ backgroundColor: colors.blue, width: WIDTH_BTN }}
                        onChangeText={(item) => setForm({ ...form, meal: item })}
                        placeholder={"Repas (secondes) * "}
                        placeholderTextColor={colors.background_w}
                        value={form.meal}
                        keyboardType='numeric'
                        className="py-4 rounded text-center mb-[10]"
                    />
                    <TouchableOpacity className={"py-2 pb-4 px-8"} style={[{width:WIDTH_BTN}]} onPress={showDeleteConfirmation}>
                    <Text className="text-center font-xl text-2xl p-3 rounded-xl " style={[{backgroundColor: colors.orange, color: colors.background}] }> Ajouter l'animal </Text>
                    </TouchableOpacity>

                    <Modal
                    visible={showModal}
                    animationType="fade"
                    transparent={true}
                    onRequestClose={hideDeleteConfirmation}
                    >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                        <Text className="text-xl"style={{ color: colors.black}}> Ajouter l'animal</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity className="py-[10] w-[120] rounded-xl"onPress={handleAddAnimal} style={{backgroundColor: colors.orange}}>
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
            </View>
        </KeyboardAvoidingView>
    );
}

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

export default addPet;
