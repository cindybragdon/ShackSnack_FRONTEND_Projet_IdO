import React from "react";
import { View, ScrollView, Text } from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width ;

const StatsScreen = () => {
  return (
    <ScrollView className="flex-1 p-4 bg-gray-100">
      {/* Graphique 1 - Fréquence des repas par jour */}
      <View className="mb-8 bg-white p-4 rounded-lg shadow-md">
        <Text className="text-lg font-bold text-center mb-2">Fréquence des repas par jour</Text>
        <BarChart
          data={{
            labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
            datasets: [{ data: [3, 2, 4, 3, 5, 2, 4] }],
          }}
          width={screenWidth - 56}
          height={220}
          yAxisLabel=""
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            color: (opacity = 1) => `rgba(26, 115, 232, ${opacity})`,
          }}
        />
      </View>

      {/* Graphique 2 - Répartition des repas par heure */}
      <View className="mb-8 bg-white p-4 rounded-lg shadow-md">
        <Text className="text-lg font-bold text-center mb-2">Répartition des repas par heure</Text>
        <BarChart
          data={{
            labels: ["00h", "06h", "12h", "18h", "00h"],
            datasets: [{ data: [2, 3, 5, 4, 3] }],
          }}
          width={screenWidth - 56}
          height={220}
          yAxisLabel=""
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
          }}
        />
      </View>

      {/* Graphique 3 - Comparaison de l’alimentation de plusieurs animaux */}
      <View className="mb-8 bg-white p-4 rounded-lg shadow-md">
        <Text className="text-lg font-bold text-center mb-2">Comparaison entre plusieurs animaux</Text>
        <LineChart
          data={{
            labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
            datasets: [
              { data: [3, 2, 3, 4, 2, 5, 4], color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`, strokeWidth: 2 },
              { data: [2, 3, 4, 3, 4, 2, 5], color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`, strokeWidth: 2 },
            ],
          }}
          width={screenWidth - 56}
          height={220}
          yAxisLabel=""
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
          }}
          bezier
        />
      </View>
    </ScrollView>
  );
};

export default StatsScreen;
