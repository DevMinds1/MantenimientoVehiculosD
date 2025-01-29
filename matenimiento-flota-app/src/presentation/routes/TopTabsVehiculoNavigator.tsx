import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { MisVehiculoScreen } from "../screens/vehiculos/MisVehiculosPesadosScreen";
import { MisVehiculosLivianosScreen } from "../screens/vehiculos/MisVehiculosLivianosScreen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { VerMantenimientoPendienteScreen } from "../screens/mantenimientos/VerMantenimientoPendienteScreen";
import { VerMantenimientoCompletadoScreen } from "../screens/mantenimientos/VerMantenimientoCompletadoScreen";
import { VerMantenimientoEnTaller } from "../screens/mantenimientos/VerMantenimeintoEnTallerScreen";
import { useUser } from "../components/userAut/userContext";

const Tab = createMaterialTopTabNavigator();

export const TopTabsVehiculoNavigator = () => {
  const { top } = useSafeAreaInsets();
    const { user } = useUser();
  return (
    <Tab.Navigator style={{ marginTop: top }}>
      <Tab.Screen
        name="Pendientes"
        component={VerMantenimientoPendienteScreen}
      />
      {user?.role == "mandated" && (
      <Tab.Screen name="Taller" component={VerMantenimientoEnTaller} />
      )}
      <Tab.Screen
        name="Completados"
        component={VerMantenimientoCompletadoScreen}
      />
    </Tab.Navigator>
  );
};
