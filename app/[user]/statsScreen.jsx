import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, ActivityIndicator } from "react-native";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { getAllFeedingLogsOfUser, getAnimals, getUser } from "../../lib/axios";
import moment from "moment";
import "moment/locale/fr";

const screenWidth = Dimensions.get("window").width;

const StatsScreen = () => {
  const [feedingLogs, setFeedingLogs] = useState(null);
  const [user, setUser] = useState(null);
  const [animals, setAnimals] = useState(null);
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

  // Transformation des logs en données exploitables
  const processFeedingData = () => {
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

    // Couleurs du PieChart pour harmonisation
    const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"];

    const datasets = animals.map((animal, index) => ({
      data: last7Days.map((day) => feedingPerDay[day][animal._id] || 0),
      color: (opacity = 1) => `${colors[index % colors.length]}${Math.round(opacity * 255).toString(16)}`, 
      strokeWidth: 2,
    }));

    return { labels: last7Days, datasets, legend: animals.map((a) => a.name) };
  };

  const feedingDataProcessed = processFeedingData();

  return (
    <ScrollView className="flex-1 p-4 bg-gray-100">
      <Text className="text-lg font-bold text-center mb-2">
        Les <Text className="text-red-500">chat</Text>istiques du statisti<Text className="text-blue-500">chien</Text>
      </Text>

      {/* Graphique 1 - Nombre de gâteries par jour */}
      <View className="mb-8 bg-white p-4 rounded-lg shadow-md">
        <Text className="text-lg font-bold text-center mb-2">Qui est le plus gourmand?</Text>
        <LineChart
          data={feedingDataProcessed}
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
