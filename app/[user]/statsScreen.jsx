import React, { useEffect, useState } from "react";
import { View, ScrollView, Text } from "react-native";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { getAllFeedingLogsOfUser, getAnimals, getUser } from "../../lib/axios";

const screenWidth = Dimensions.get("window").width;

const StatsScreen = () => {


  const [dataFeeding,setFeedingData] = useState({});

  const [user, setUSer] = useState({});

  const [animals, setAnimals] = useState([]);


  useEffect(() => {
    async function loadFeedingLogDataOfUser() {
      try {
        const user = await getUser();
        console.log("User:", user);
        setUSer(user);
  
        const feedingData = await getAllFeedingLogsOfUser(user.id);
        console.log("Feeding Data:", feedingData);
        setFeedingData(feedingData || []);
  
        const fetchedAnimals = await getAnimals();
        console.log("Animals:", fetchedAnimals);
        setAnimals(fetchedAnimals || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  
    loadFeedingLogDataOfUser();
  }, []);
  

    console.log("data feeding : ");
    console.log(dataFeeding);

    console.log("animals :")
    console.log(animals)
  return (
    <ScrollView className="flex-1 p-4 bg-gray-100">
      <Text className="text-lg font-bold text-center mb-2">
        Les <Text className="text-red-500">chat</Text>istiques du statisti<Text className="text-blue-500">chien</Text>
      </Text>

      {/* Graphique 1 - Comparaison de l’alimentation de plusieurs animaux */}
      <View className="mb-8 bg-white p-4 rounded-lg shadow-md">
        <Text className="text-lg font-bold text-center mb-2">Qui est le plus gourmand?</Text>
        <LineChart
          data={{
            labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
            datasets: [
              { data: [3, 2, 3, 4, 2, 5, 4], color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`, strokeWidth: 2 },
              { data: [2, 3, 4, 3, 4, 2, 5], color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`, strokeWidth: 2 },
              { data: [4, 3, 5, 2, 4, 3, 6], color: (opacity = 1) => `rgba(255, 206, 86, ${opacity})`, strokeWidth: 2 },
            ],
            legend: animals.length ? animals.map(animal => animal.name) : ["Aucun animal"], 
          }}
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

      {/* Graphique 2 - Fréquence des repas par jour */}
      <View className="mb-8 bg-white p-4 rounded-lg shadow-md">
        <Text className="text-lg font-bold text-center mb-2">Fréquence des repas par jour</Text>
        <BarChart
          data={{
            labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
            datasets: [{ data: [3, 2, 4, 3, 5, 2, 4] }],
          }}
          width={screenWidth - 56}
          height={220}
          yAxisSuffix="x"
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            color: (opacity = 1) => `rgba(26, 115, 232, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
        />
      </View>

      {/* Graphique 3 - Répartition des repas par moment de la journée */}
      <View className="mb-8 bg-white p-4 rounded-lg shadow-md">
        <Text className="text-lg font-bold text-center mb-2">Répartition des repas par moment de la journée</Text>
        <PieChart
          data={[
            { name: "Matin", population: 5, color: "#FF6384", legendFontColor: "#000", legendFontSize: 14 },
            { name: "Midi", population: 8, color: "#36A2EB", legendFontColor: "#000", legendFontSize: 14 },
            { name: "Soir", population: 6, color: "#FFCE56", legendFontColor: "#000", legendFontSize: 14 },
            { name: "Nuit", population: 3, color: "#4BC0C0", legendFontColor: "#000", legendFontSize: 14 },
          ]}
          width={screenWidth - 56}
          height={220}
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>
    </ScrollView>
  );
};

export default StatsScreen;
