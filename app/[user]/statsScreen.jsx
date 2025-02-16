import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, ActivityIndicator } from "react-native";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import { Picker } from "@react-native-picker/picker";  
import { Dimensions } from "react-native";
import { getAllFeedingLogsOfUser, getAnimals, getUser } from "../../lib/axios";
import moment from "moment";
import "moment/locale/fr";

const screenWidth = Dimensions.get("window").width;

const StatsScreen = () => {
  const [feedingLogs, setFeedingLogs] = useState(null);
  const [user, setUser] = useState(null);
  const [animals, setAnimals] = useState(null);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFeedingLogDataOfUser() {
      try {
        const userData = await getUser();
        setUser(userData);

        const feedingData = await getAllFeedingLogsOfUser(userData.id);
        setFeedingLogs(feedingData || []);

        const fetchedAnimals = await getAnimals();
        setAnimals(fetchedAnimals || []);

        if (fetchedAnimals.length > 0) {
          setSelectedAnimal(fetchedAnimals[0]._id);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadFeedingLogDataOfUser();
  }, []);

  if (isLoading || !feedingLogs || !animals) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Chargement des données...</Text>
      </View>
    );
  }

  // **Graphique 1** - Données de tous les animaux (LineChart)
  const processFeedingDataAllAnimals = () => {
    const last7Days = [];
    const feedingPerDay = {};

    for (let i = 6; i >= 0; i--) {
      const day = moment().subtract(i, "days").format("ddd");
      last7Days.push(day);
      feedingPerDay[day] = {};
    }

    feedingLogs.forEach((log) => {
      const feedingDay = moment(log.feeding_date).format("ddd");
      if (last7Days.includes(feedingDay)) {
        if (!feedingPerDay[feedingDay][log.animalId]) {
          feedingPerDay[feedingDay][log.animalId] = 0;
        }
        feedingPerDay[feedingDay][log.animalId] += log.feeding_quantity;
      }
    });

    const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"];
    const datasets = animals.map((animal, index) => ({
      data: last7Days.map((day) => feedingPerDay[day][animal._id] || 0),
      color: (opacity = 1) => `${colors[index % colors.length]}${Math.round(opacity * 255).toString(16)}`,
      strokeWidth: 2,
    }));

    return { labels: last7Days, datasets, legend: animals.map((a) => a.name) };
  };

  const feedingDataAllAnimals = processFeedingDataAllAnimals();

  // **Graphiques 2 & 3** - Données filtrées pour un animal spécifique
  const processFeedingDataForAnimal = (animalId) => {
    if (!animalId) return { barData: [], pieData: [] };

    const categories = {
      Matin: 0, // 6h - 12h
      Midi: 0,  // 12h - 18h
      Soir: 0,  // 18h - 00h
      Nuit: 0   // 00h - 6h
    };

    feedingLogs
      .filter((log) => log.animalId === animalId)
      .forEach((log) => {
        const hour = moment(log.feeding_date).hour();
        if (hour >= 6 && hour < 12) categories.Matin += log.feeding_quantity;
        else if (hour >= 12 && hour < 18) categories.Midi += log.feeding_quantity;
        else if (hour >= 18 && hour < 24) categories.Soir += log.feeding_quantity;
        else categories.Nuit += log.feeding_quantity;
      });

      const pieData = Object.keys(categories)
      .map((key, index) => ({
        name: key,
        population: categories[key] || 0, // 🔹 Ajoute une valeur par défaut
        color: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"][index % 4] , // 🔹 Empêche les couleurs undefined
        legendFontColor: "#000",
        legendFontSize: 14,
      }))
      .filter((item) => item.population > 0); // 🔹 Supprime les éléments vides



    return { barData: Object.values(categories), pieData };
  };
  const feedingDataForAnimal = processFeedingDataForAnimal(selectedAnimal) || { barData: [], pieData: [] };


  const formattedPieData = feedingDataForAnimal?.pieData?.length > 0 
  ? feedingDataForAnimal.pieData.map((item, index) => ({
      ...item,
      color: item?.color || ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"][index % 4], // Ajoute une couleur par défaut
    }))
  : [];
  console.log("Colors : ")
  console.log(formattedPieData)



  const testData = [
    { name: "Soir", population: 9, color: "#FFCE56", legendFontColor: "#000", legendFontSize: 14 },
    { name: "Matin", population: 5, color: "#36A2EB", legendFontColor: "#000", legendFontSize: 14 },
  ];
  return (
    <ScrollView className="flex-1 p-4 bg-gray-100">
      <Text className="text-lg font-bold text-center mb-2">
        Les <Text className="text-red-500">chat</Text>istiques du statisti<Text className="text-blue-500">chien</Text>
      </Text>
  
      {/* Graphique 1 - Tous les animaux */}
      <View className="mb-8 bg-white p-4 rounded-lg shadow-md">
        <Text className="text-lg font-bold text-center mb-2">Qui est le plus gourmand?</Text>
        <LineChart
          data={feedingDataAllAnimals}
          width={screenWidth - 56}
          height={220}
          yAxisSuffix=" gâteries"
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            decimalPlaces: 0,
          }}
          bezier
        />
      </View>

      <Text className="text-blue-500">Choisir</Text>
  
      {/* Dropdown pour sélectionner un animal */}
      <Picker selectedValue={selectedAnimal} onValueChange={(itemValue) => setSelectedAnimal(itemValue)}>
        {animals.map((animal) => (
          <Picker.Item key={animal._id} label={animal.name} value={animal._id} />
        ))}
      </Picker>
  
      {/* Graphique 2 - Fréquence des repas */}
      <View className="mb-8 bg-white p-4 rounded-lg shadow-md">
        <Text className="text-lg font-bold text-center mb-2">Fréquence des repas par moment de la journée</Text>
        <BarChart
          data={{ labels: ["Matin", "Midi", "Soir", "Nuit"], datasets: [{ data: feedingDataForAnimal?.barData }] }}
          width={screenWidth - 56}
          height={220}
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            color: (opacity = 1) => `rgba(26, 115, 232, ${opacity})`,
          }}
        />
      </View>
  
    {/* Graphique 3 - Répartition des repas */}
    
    {formattedPieData && formattedPieData?.length > 0 && (
      
        <PieChart
        
          data={formattedPieData}
          width={screenWidth - 56}
          height={220}
          accessor="population"
          chartConfig={{
            backgroundColor: "#FFF",
            backgroundGradientFrom: "#FFF",
            backgroundGradientTo: "#FFF",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Ensure this is a function
          }}
          backgroundColor="transparent"
          paddingLeft="15"
        />
      )}
      
    </ScrollView>
  );
  
};

export default StatsScreen;
