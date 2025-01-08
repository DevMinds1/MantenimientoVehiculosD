import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen } from "../screens/login/LoginScreen";
import { HomeScreen } from "../screens/home/HomeScreen";
import { SideMenuNavigator } from "./SaveMenuNavigator";
import { RegistrarVehiculoScreen } from "../screens/vehiculos/RegistrarVehiculoScreen";
import { MisVehiculoScreen } from "../screens/vehiculos/MisVehiculosPesadosScreen";
import { ButtonTabNavigator } from "./ButtonTabsNavigator";

export type RootStackParams = {
  HomeStack: undefined;
  LoginScreen: undefined;
};

const Stack = createStackNavigator<RootStackParams>();

export const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeStack" component={ButtonTabNavigator} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
    </Stack.Navigator>
  );
};
