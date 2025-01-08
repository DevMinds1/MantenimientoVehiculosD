import {
  DrawerActions,
  NavigationContainer,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import React, { useEffect } from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { RootMenuParams } from "../../routes/SaveMenuNavigator";
import { globalStyles } from "../../theme/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProgressBar } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootMenuParams>>();
  const { top } = useSafeAreaInsets();

  return (
    <View style={globalStyles(top).container}>
      <Pressable
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer)}
      >
        <Ionicons
          name="menu-outline"
          size={32}
          color="#004270"
          style={styles.iconStyle}
        />
      </Pressable>
      <View style={styles.container}>
        {/* Header */}
        <Text style={styles.welcomeText}>Bienvenido Henry</Text>
        <Text style={styles.subtitleText}>Tu resumen de funcionalidad</Text>

        {/* Resumen Diario */}
        <Text style={styles.sectionTitle}>Resumen diario</Text>
        <View style={styles.progressContainer}>
          <View style={styles.containerTextProgress}>
            <Text style={styles.progressText}>Vehículos en Taller</Text>
            <Text style={styles.progressText}>2</Text>
          </View>

          <ProgressBar
            progress={0.1}
            color="#FDC600"
            style={styles.progressBar}
          />

          <View style={styles.containerTextProgress}>
            <Text style={styles.progressText}>Total Vehículos disponibles</Text>
            <Text style={styles.progressText}>21</Text>
          </View>

          <ProgressBar
            progress={0.9}
            color="#00274E"
            style={styles.progressBar}
          />
        </View>

        {/* Resumen Mensual */}
        <Text style={styles.sectionTitle}>Resumen mensual</Text>
        <View style={styles.monthlySummary}>
          <View style={styles.circle}></View>
          <View>
            <View style={styles.containerTextMonthly}>
              <View style={styles.circleres1}></View>
              <Text style={styles.monthlyText}>Mantenimientos Preventivos</Text>
            </View>
            <View style={styles.containerTextMonthly}>
              <View style={styles.circleres2}></View>
              <Text style={styles.monthlyText}>Mantenimientos Correctivos</Text>
            </View>
          </View>
        </View>

        {/* Resumen Anual */}
        <Text style={styles.sectionTitle}>Resumen anual</Text>
        <View style={styles.containerAnual}>
          <Image
            source={{
              uri: "https://github.com/JonathanCoronel/uploadimg/blob/main/Imagenes%20Arquitectura/Group%20782.png?raw=true",
            }}
            style={{ width: "100%", height: "100%" }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,

  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 600,
    color: "#004270",
    fontFamily: "Inter",
  },
  subtitleText: {
    fontSize: 14,
    color: "#004270",
    fontWeight: 400,
    fontFamily: "Inter",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: "#004270",
    marginTop: 20,
    marginBottom: 10,
    fontFamily: "Inter",
    textAlign: "center",
  },
  progressContainer: {
    marginTop: 10,
    marginBottom: 5,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  containerTextProgress: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 5,
  },
  progressText: {
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: 400,
    color: "#2A2A2A",
    marginBottom: 5,
  },
  monthlySummary: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: "#F2B705",
    marginRight: 15,
  },
  circleres1: {
    width: 10,
    height: 10,
    borderRadius: 100,
    backgroundColor: "#FEBE10",
    marginRight: 10,
  },
  circleres2: {
    width: 10,
    height: 10,
    borderRadius: 100,
    backgroundColor: "#004270",
    marginRight: 15,
  },
  monthlyText: {
    fontSize: 14,
    color: "#6C757D",
    marginBottom: 5,
    fontWeight: 400,
    fontFamily: "Inter",

    width: "60%",
  },
  containerTextMonthly: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    width: "100%",
  },
  iconStyle: {
    marginTop: 10,
  },
  containerAnual: {
    width: "100%",
    height: 250,
  },
});
