import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { MisVehiculoScreen } from "../screens/vehiculos/MisVehiculosPesadosScreen";
import { MisVehiculosLivianosScreen } from "../screens/vehiculos/MisVehiculosLivianosScreen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { VerMantenimientoPendienteScreen } from "../screens/mantenimientos/VerMantenimientoPendienteScreen";

const Tab = createMaterialTopTabNavigator();

export const TopTabsVehiculoNavigator = () => {
  const { top } = useSafeAreaInsets();
  return (
    <Tab.Navigator style={{ marginTop: top}}>
      <Tab.Screen
        name="Pendientes"
        component={VerMantenimientoPendienteScreen}
      />
      <Tab.Screen name="Completados" component={VerMantenimientoPendienteScreen} />
    </Tab.Navigator>
  );
};
