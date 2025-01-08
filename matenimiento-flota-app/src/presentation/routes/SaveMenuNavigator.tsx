import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerItem,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { Dimensions, View, Text, Image } from "react-native";
import { globalColors } from "../theme/theme";
import React, { useState } from "react";
import { PerfilScreen } from "../screens/perfil/PerfilScreen";
import { HomeScreen } from "../screens/home/HomeScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { RegistrarVehiculoScreen } from "../screens/vehiculos/RegistrarVehiculoScreen";

import { RegistrarTallerScreen } from "../screens/talleres/RegistrarTallerScreen";
import { TopTabsVehiculoNavigator } from "./TopTabsVehiculoNavigator";
import { MisVehiculoScreen } from "../screens/vehiculos/MisVehiculosPesadosScreen";
import { MisVehiculosLivianosScreen } from "../screens/vehiculos/MisVehiculosLivianosScreen";
import { ButtonTabNavigator } from "./ButtonTabsNavigator";
import { MiMecanicaScreen } from "../screens/talleres/MiMecanicaScreen";
import { MiConsecionarioScreen } from "../screens/talleres/MiConcesionarioScreen";
import { VerMantenimientoPendienteScreen } from "../screens/mantenimientos/VerMantenimientoPendienteScreen";
import { VerMantenimientoCompletadoScreen } from "../screens/mantenimientos/VerMantenimientoCompletadoScreen";

const Drawer = createDrawerNavigator();

export type RootMenuParams = {
  Home: undefined;
  RegistrarVehiculos: { screen: string };
  MisVehiculos: undefined;
  VehiculosLivianos: undefined;
  MiMecanicaScreen: undefined;
  MiConsecionarioScreen: undefined;
};

export const SideMenuNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: globalColors.secondary,
        drawerActiveTintColor: globalColors.primary,
        drawerInactiveTintColor: globalColors.primary,
        drawerStyle: {
          width: Dimensions.get("window").width * 0.7,
        },
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="RegistrarVehiculo" component={RegistrarVehiculoScreen} />
      <Drawer.Screen name="MisVehiculos" component={MisVehiculoScreen} />
      <Drawer.Screen name="VehiculosLivianos" component={MisVehiculosLivianosScreen} />
      <Drawer.Screen name="MiMecanicaScreen" component={MiMecanicaScreen} />
      <Drawer.Screen name="MiConsecionarioScreen" component={MiConsecionarioScreen} />
      <Drawer.Screen name="Talleres" component={RegistrarTallerScreen} />
      <Drawer.Screen name="MantenimientosPendientes" component={VerMantenimientoPendienteScreen} />
      <Drawer.Screen name="MantenimientosCompletados" component={VerMantenimientoCompletadoScreen} />
      <Drawer.Screen name="Perfil" component={PerfilScreen} />
    </Drawer.Navigator>
  );
};

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const [vehiculoOpen, setVehiculoOpen] = useState(false);
  const [tallerOpen, setTallerOpen] = useState(false);
  const [mantenimientoOpen, setmantenimientoOpen] = useState(false);

  const toggleVehiculoMenu = () => {
    setVehiculoOpen(!vehiculoOpen);
  };

  const toggleTallerMenu = () => {
    setTallerOpen(!tallerOpen);
  };

  const toggleMantenimientoMenu = () => {
    setmantenimientoOpen(!mantenimientoOpen);
  };

  const closeDrawerAndNavigate = (
    navigatorName: string,
    screenName: string
  ) => {
    if (navigatorName && screenName) {
      props.navigation.navigate(navigatorName, {
        screen: screenName,
      });
    }
    setVehiculoOpen(false);
    setTallerOpen(false);
    setmantenimientoOpen(false);
  };

  const closeDrawerAndNavigateUno = (screenName: string) => {
    props.navigation.navigate(screenName);
    setVehiculoOpen(false);
    setTallerOpen(false);
    setmantenimientoOpen(false);
  };
  return (
    <DrawerContentScrollView {...props}>
      <View
        style={{
          backgroundColor: globalColors.primary,
          height: 68,
          width: 68,
          marginTop: 30,
          marginLeft: 15,
          marginBottom: 10,
          borderRadius: 100,
        }}
      >
        <Image
          source={{
            uri: "https://github.com/JonathanCoronel/uploadimg/blob/main/Imagenes%20Arquitectura/me%201.png?raw=true",
          }}
          style={{ width: "100%", height: "100%" }}
        />
      </View>
      <Text
        style={{
          color: globalColors.dark,
          marginLeft: 15,
          fontSize: 16,
          fontWeight: "700",
          lineHeight: 16,
          marginBottom: 10,
        }}
      >
        Henry, Arthur
      </Text>
      <Text
        style={{
          color: globalColors.rol,
          marginLeft: 15,
          fontSize: 16,
          fontWeight: "400",
          lineHeight: 16,
          marginBottom: 20,
        }}
      >
        Administrador
      </Text>

      <View
        style={{
          height: 1,
          backgroundColor: "#E2E4E5",
          marginHorizontal: -11,
          marginBottom: 20,
        }}
      />

      <DrawerItem
        label="Inicio"
        icon={() => <Ionicons name="home-outline" size={24} color="#A0A0A0" />}
        onPress={() => closeDrawerAndNavigateUno("Home")}
        
      />

      <DrawerItem
        label="Vehículo"
        icon={() => <AntDesign name="car" size={24} color="#A0A0A0" />}
        onPress={toggleVehiculoMenu}
      />

      {vehiculoOpen && (
        <>
          <DrawerItem
            label="Registrar Vehículo"
            style={{ marginLeft: "15%" }}
            icon={() => <Ionicons name="ellipse" size={7} color="#A0A0A0" />}
            onPress={() => closeDrawerAndNavigateUno("RegistrarVehiculo")}
          />
          <DrawerItem
            label="Mis Vehículos"
            style={{ marginLeft: "15%" }}
            icon={() => <Ionicons name="ellipse" size={7} color="#A0A0A0" />}
            onPress={() => closeDrawerAndNavigateUno("VehiculosLivianos")}
          />
        </>
      )}

      <DrawerItem
        label="Talleres"
        onPress={toggleTallerMenu}
        icon={() => (
          <MaterialCommunityIcons name="car-key" size={24} color="#A0A0A0" />
        )}
      />

      {tallerOpen && (
        <>
          <DrawerItem
            label="Registrar Talleres"
            style={{ marginLeft: "15%" }}
            icon={() => <Ionicons name="ellipse" size={7} color="#A0A0A0" />}
            onPress={() => closeDrawerAndNavigateUno("Talleres")}
          />
          <DrawerItem
            label="Mis Talleres"
            style={{ marginLeft: "15%" }}
            icon={() => <Ionicons name="ellipse" size={7} color="#A0A0A0" />}
            onPress={() => closeDrawerAndNavigateUno("MiMecanicaScreen")}
          />
        </>
      )}

      <DrawerItem
        label="Mantenimientos"
        onPress={toggleMantenimientoMenu}
        icon={() => (
          <FontAwesome6 name="screwdriver-wrench" size={24} color="#A0A0A0" />
        )}
      />

      {mantenimientoOpen && (
        <>
          <DrawerItem
            label="Preventivo"
            style={{ marginLeft: "15%" }}
            icon={() => <Ionicons name="ellipse" size={7} color="#A0A0A0" />}
            onPress={() => closeDrawerAndNavigate("Tab", "Mantenimientos")}
          />
          <DrawerItem
            label="Correctivo"
            style={{ marginLeft: "15%" }}
            icon={() => <Ionicons name="ellipse" size={7} color="#A0A0A0" />}
            onPress={() => closeDrawerAndNavigate("Tab", "Mantenimientos")}
          />
        </>
      )}

      <DrawerItem
        label="Perfil"
        onPress={() => closeDrawerAndNavigateUno("Perfil")}
        icon={() => <FontAwesome6 name="user" size={24} color="#A0A0A0" />}
      />
    </DrawerContentScrollView>
  );
};



