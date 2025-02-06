import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get("window").width;


const data = {
  labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'], // Meses
  datasets: [
    {
      data: [10, 20, 15, 20, 15, 10, 9, 7], // Valores de los datos
      strokeWidth: 2, // Grosor de la línea
      color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`, // Color de la línea (naranja)
      withDots: true, // Mostrar puntos
      dotColor: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`, // Color de los puntos
    },
  ],
};

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0, // Número de decimales
  color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: "6", 
    strokeWidth: "2", 
    stroke: "#ffa500", 
  },
};

const MyChart = () => {
  return (
    <View style= {{ width:'100%'}}>
      <LineChart
        data={data}
        width={screenWidth - 70} 
        height={220}
        chartConfig={chartConfig}
        bezier 
        style={{ marginVertical: 8 }}
      />
    </View>
  );
};

export default MyChart;
