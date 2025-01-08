import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "../screens/home/HomeScreen";

import Ionicons from "@expo/vector-icons/Ionicons";
import Fontisto from "@expo/vector-icons/Fontisto";
import AntDesign from "@expo/vector-icons/AntDesign";


import { SideMenuNavigator } from "./SaveMenuNavigator";

import { TopTabsVehiculoNavigator } from "./TopTabsVehiculoNavigator";


export type RootButtonParams = {
  HomeTab: { screen: string };
  Vehiculos: { screen: string };
};

const Tab = createBottomTabNavigator();

export const ButtonTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          marginBottom: 5,
          shadowColor: "trasparent",
          borderColor: "transparent",
        },
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarActiveTintColor: "#004270",
        tabBarInactiveTintColor: "#A0A0A0",
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={SideMenuNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
          tabBarLabel: "Inicio",
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault(); 
            navigation.navigate("HomeTab", { screen: "Home" }); 
          },
        })}
      />

      <Tab.Screen
        name="Vehiculos"
        component={SideMenuNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="car" size={size} color={color} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault(); 
            navigation.navigate("Vehiculos", { screen: "VehiculosLivianos" }); 
          },
        })}
      />
      <Tab.Screen
        name="Mantenimientos"
        component={TopTabsVehiculoNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Fontisto name="file-1" size={size} color={color} />
          ),
        }}
      />
      
    </Tab.Navigator>
  );
};
