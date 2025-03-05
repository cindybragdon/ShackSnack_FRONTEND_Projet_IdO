import { View, Text, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useRouter, useFocusEffect } from 'expo-router';
import { color } from '../../assets/color';
import { getAnimals } from '../../lib/axios';
import { Font } from 'expo-font'; 
import React, { useState, useEffect, useCallback } from 'react';

const MyAnimal = () => {
    const { theme } = useTheme();
    const router = useRouter();
    const colors = color[theme];
    const WIDTH_BTN = Dimensions.get('window').width - 56;
    const [fontLoaded, setFontLoaded] = useState(false);
    const [animals, setAnimals] = useState([]);
    const [selectedAnimal, setSelectedAnimal] = useState(null)
     

    useEffect(() => {
        async function loadFont() {
            await Font.loadAsync({
                'cookie': require('../../assets/font/Cookie-Regular.ttf'),
            });
            setFontLoaded(true);
        }

        loadFont();
    }, []);

    const fetchAnimals = async () => {
        try {
            const userAnimals = await getAnimals();
            if (userAnimals) {
                setAnimals(userAnimals);
                if (userAnimals.length > 0) {
                    setSelectedAnimal(userAnimals[0]._id);
                }
            }
        } catch (error) {
            console.error("Erreur lors du chargement des animaux :", error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchAnimals();  
        }, [])
    );

    const renderAnimalItem = ({ item }) => (
        <TouchableOpacity
            style={{
                backgroundColor: selectedAnimal === item._id ? colors.orange : colors.card, 
                padding: 10,
                borderRadius: 8,
                width: '100%',
            }}
          
            onPress={() => {
              router.push({
                pathname: `${item._id}/animalProfil/`,
                params: {
                  id: item._id,
 
                },
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
            <Text className="font-bold text-3xl mb-[-20]" style={{ color: colors.orange }}>
                vos
            </Text>
            <Text className="text-7xl text-center tracking-[4px]" style={{ fontFamily: 'cookie', color: colors.black }}>
                Animaux
            </Text>

            {animals.length > 0 ? (
                <FlatList
                    data={animals}
                    renderItem={renderAnimalItem}
                    keyExtractor={(item) => item._id.toString()}
                    style={{ padding: 10 , width: WIDTH_BTN}}
                />
            ) : (
                <Text className="justify-center" style={{ color: colors.orange }}>
                    Vous n'avez pas encore ajouté d'animal à votre liste.
                </Text>
            )}

            

            <TouchableOpacity>
                <Text
                    className="text-center rounded-[12] py-[12] text-2xl mb-[100]"
                    style={{ backgroundColor: colors.orange, width: WIDTH_BTN }}
                    onPress={() => router.push('./addPet')}
                >
                    Ajouter un animal
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default MyAnimal;
