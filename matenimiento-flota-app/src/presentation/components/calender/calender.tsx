import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars"; // Importa el calendario
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { globalStyles } from "../../theme/theme";

export const Calender = ({ onSelectDate }: { onSelectDate: (date: string) => void }) => {
  const { top } = useSafeAreaInsets();

  // Estado para almacenar la fecha seleccionada
  const [selectedDate, setSelectedDate] = useState<string>("");

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    onSelectDate(day.dateString); 
  };

  // Lógica para marcar la fecha seleccionada
  const markedDates = {
    [selectedDate]: {
      selected: true,
      selectedColor: "#00adf5",
      selectedTextColor: "#ffffff",
    },
  };

  return (
    <View style={styles.container}>
      <Calendar
        initialDate={"2025-01-01"}
        monthFormat={"MMMM"} 
        onDayPress={handleDayPress}
        markedDates={markedDates} 
        locale="es"  // Aquí defines el idioma en español
        theme={{
          selectedDayBackgroundColor: "#00adf5",  // Color de fondo para el día seleccionado
          selectedDayTextColor: "#ffffff",  // Color de texto del día seleccionado
          todayTextColor: "#00adf5",  // Color de texto de hoy
          dayTextColor: "#2d4150",  // Color de texto para los días
          arrowColor: "#00adf5",  // Color de las flechas de navegación
          monthTextColor: "#000000",  // Color del mes
          textDayFontFamily: "Arial",  // Tipografía para los días
          textMonthFontFamily: "Arial",  // Tipografía para el mes
          textDayFontWeight: "normal",  // Peso de la fuente de los días
          textMonthFontWeight: "bold",  // Peso de la fuente del mes
          textDayFontSize: 16,  // Tamaño de la fuente de los días
          textMonthFontSize: 18,  // Tamaño de la fuente del mes
        }}
        style={styles.calendar}
      />

      {/* Mostrar la fecha seleccionada */}
{/*       {selectedDate ? (
        <Text style={styles.selectedDateText}>
          Fecha seleccionada: {selectedDate}
        </Text>
      ) : (
        <Text style={styles.selectedDateText}>Selecciona una fecha</Text>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
    container:{

    },
  calendar: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#fff",
    width: "100%",  
    alignSelf: "center",  
    marginTop: 1,
  },
  selectedDateText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
});

export default Calender;
